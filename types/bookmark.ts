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
  tags: string;
}
