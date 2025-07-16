export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  created_at: string;
  user_id: string; // Add user_id field
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

export const BOOKMARK_CATEGORIES = [
  { id: 'ngoding', label: 'Ngoding', icon: '💻', color: 'bg-blue-500' },
  { id: 'meme', label: 'Meme', icon: '😂', color: 'bg-purple-500' },
  { id: 'shopping', label: 'Shopping', icon: '🛒', color: 'bg-orange-500' },
  { id: 'roblox', label: 'Roblox', icon: '😎', color: 'bg-emerald-500' },
  { id: 'education', label: 'Education', icon: '📚', color: 'bg-pink-500' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', color: 'bg-rose-500' },




] as const;
