export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  created_at: string;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

export const BOOKMARK_CATEGORIES = [
  { id: 'development', label: 'Development', icon: '💻', color: 'bg-blue-500' },
  { id: 'design', label: 'Design', icon: '🎨', color: 'bg-purple-500' },
  { id: 'social', label: 'Social Media', icon: '📱', color: 'bg-pink-500' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-red-500' },
  { id: 'education', label: 'Education', icon: '📚', color: 'bg-green-500' },
  { id: 'news', label: 'News', icon: '📰', color: 'bg-yellow-500' },
  { id: 'tools', label: 'Tools', icon: '🛠️', color: 'bg-gray-500' },
  { id: 'shopping', label: 'Shopping', icon: '🛒', color: 'bg-orange-500' },
  { id: 'health', label: 'Health', icon: '⚕️', color: 'bg-teal-500' },
  { id: 'finance', label: 'Finance', icon: '💰', color: 'bg-emerald-500' },
] as const;
