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
  getAll: async (userId: string): Promise<Bookmark[]> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>): Promise<Bookmark> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        ...bookmark,
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

  update: async (id: number, updates: Partial<Bookmark>): Promise<Bookmark> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ===============================
// CUSTOM HOOKS
// ===============================

/**
 * Hook untuk fetch semua bookmarks user
 */
export function useBookmarks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: bookmarkKeys.list(user?.id || ''),
    queryFn: () => bookmarkApi.getAll(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  
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
      bookmarkApi.update(id, updates),
    onSuccess: (updatedBookmark) => {
      // Update the bookmark in cache
      queryClient.setQueryData(
        bookmarkKeys.list(user?.id || ''),
        (old: Bookmark[] = []) =>
          old.map(bookmark =>
            bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
          )
      );
      
      toast.success('✅ Bookmark berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Error updating bookmark:', error);
      toast.error('❌ Gagal memperbarui bookmark');
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
