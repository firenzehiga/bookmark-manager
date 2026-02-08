import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Bookmark } from '@/types/bookmark';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// ===============================
// QUERY KEYS (Best Practice)
// ===============================
export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (userId: string) => [...bookmarkKeys.lists(), userId] as const,
  details: () => [...bookmarkKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookmarkKeys.details(), id] as const,
};

// ===============================
// API FUNCTIONS
// ===============================
const bookmarkApi = {
  getAll: async (userId: string, limit?: number): Promise<Bookmark[]> => {
    let query = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  create: async (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>): Promise<Bookmark> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        ...bookmark,
        user_id: bookmark.user_id, // Pastikan user_id disertakan
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  update: async (id: number, updates: Partial<Bookmark>, userId?: string): Promise<Bookmark> => {
    // Add `update_at` timestamp (note: your DB column is named `update_at`, not `updated_at`)
    // This will set the update timestamp to the current time.
    let builder = supabase
      .from('bookmarks')
      .update({
        ...updates,
        update_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (userId) {
      // include user filter to satisfy RLS policies that require owner match
      builder = builder.eq('user_id', userId);
    }

    const { data, error } = await builder.select().single();

    if (error) throw error;
    return data;
  },

  // new: fetch public bookmarks (anyone)
  getPublic: async (): Promise<Bookmark[]> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};


// ===============================
// CUSTOM HOOKS
// ===============================

/**
 * Hook untuk fetch semua bookmarks user
 */

export function useBookmarks(limit?: number, options?: { enabled?: boolean }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...bookmarkKeys.list(user?.id || ''), limit].filter(Boolean),
    queryFn: () => bookmarkApi.getAll(user!.id, limit),
    enabled: !!user && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePublicBookmarks() {
return useQuery({
    queryKey: bookmarkKeys.lists(),
    queryFn: () => bookmarkApi.getPublic(),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook untuk create bookmark baru
 */
export function useCreateBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: bookmarkApi.create,
    onSuccess: (newBookmark) => {
      // Optimistic update
      queryClient.setQueryData(
        bookmarkKeys.list(user?.id || ''),
        (old: Bookmark[] = []) => [newBookmark, ...old]
      );
      
      // Show success toast
      toast.success('🔖 Bookmark berhasil ditambahkan!');
    },
    onError: (error) => {
      console.error('Error creating bookmark:', error);
      toast.error('❌ Gagal menambahkan bookmark');
    },
  });
}

/**
 * Hook untuk delete bookmark
 */
export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: bookmarkApi.delete,
    onMutate: async (bookmarkId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.list(user?.id || '') });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.list(user?.id || ''));

      // Optimistically remove from cache
      queryClient.setQueryData(
        bookmarkKeys.list(user?.id || ''),
        (old: Bookmark[] = []) => old.filter(bookmark => bookmark.id !== bookmarkId)
      );

      // Return a context object with the snapshotted value
      return { previousBookmarks };
    },
    onError: (err, bookmarkId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.list(user?.id || ''), context.previousBookmarks);
      }
      toast.error('❌ Gagal menghapus bookmark');
    },
    onSuccess: () => {
      toast.success('🗑️ Bookmark berhasil dihapus');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list(user?.id || '') });
    },
  });
}

/**
 * Hook untuk update bookmark
 */
export function useUpdateBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Bookmark> }) =>
      // pass current user id so the update query enforces owner match (helps with RLS)
      bookmarkApi.update(id, updates, user?.id),
    onSuccess: (updatedBookmark) => {
      // Update the bookmark in cache
      queryClient.setQueryData(
        bookmarkKeys.list(user?.id || ''),
        (old: Bookmark[] = []) =>
          old.map(bookmark =>
            bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
          )
      );
      
      // Also invalidate public bookmarks so visibility changes are reflected for guests
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });

      toast.success('Bookmark berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Error updating bookmark:', error);
      // try to extract message from Supabase error shape
      const errMsg = (error as any)?.message || (error as any)?.error || JSON.stringify(error);
      toast.error(`❌ Gagal memperbarui bookmark: ${errMsg}`);
    },
  });
}

/**
 * Hook untuk invalidate bookmarks cache (force refresh)
 */
export function useRefreshBookmarks() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return () => {
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.list(user?.id || '') });
  };
}
