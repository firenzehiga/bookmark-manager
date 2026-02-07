export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
  created_at: string;
  user_id: string; // Add user_id field
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string[];
  is_public?: boolean;
}

import { CartIcon } from "@/components/ui/cart";
import { FolderCodeIcon } from "@/components/ui/folder-code";
import { LaughIcon } from "@/components/ui/laugh";
import {  Gamepad2, School, } from "lucide-react";

export const BOOKMARK_CATEGORIES = [
  { id: 'ngoding', label: 'Ngoding', icon: FolderCodeIcon, color: 'bg-blue-500' },
  { id: 'meme', label: 'Meme', icon: LaughIcon, color: 'bg-purple-500' },
  { id: 'shopping', label: 'Shopping', icon: CartIcon, color: 'bg-orange-500' },
  { id: 'education', label: 'Education', icon: School, color: 'bg-pink-500' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-rose-500' },
] as const;

export interface MoveCardProps {
	data?: Bookmark[];
  type?: "public" | "user";
	isLoading?: boolean;
	title?: string;
	categoryFilter?: string[] | null;
	limit?: number;
}
