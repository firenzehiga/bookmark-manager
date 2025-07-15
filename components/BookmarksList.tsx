"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { Bookmark } from "@/types/bookmark";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkFilter } from "./BookmarkFilter";
import { useAuth } from "@/contexts/AuthContext";

export function BookmarksList() {
	const { user } = useAuth();
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const fetchBookmarks = async () => {
		if (!user) {
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			// Only fetch bookmarks for the current user
			const { data, error } = await supabase
				.from("bookmarks")
				.select("*")
				.eq("user_id", user.id) // Filter by user_id
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			setBookmarks(data || []);
			setFilteredBookmarks(data || []);
		} catch (error) {
			console.error("Error fetching bookmarks:", error);
			toast.error("Gagal memuat bookmark");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchBookmarks();
		} else {
			setBookmarks([]);
			setFilteredBookmarks([]);
			setIsLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]); // Re-fetch when user changes

	useEffect(() => {
		let filtered = bookmarks;

		// Filter berdasarkan search query
		if (searchQuery) {
			filtered = filtered.filter(
				(bookmark) =>
					bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					bookmark.description
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Filter berdasarkan kategori
		if (selectedCategory !== "all") {
			filtered = filtered.filter((bookmark) =>
				bookmark.tags?.includes(selectedCategory)
			);
		}

		setFilteredBookmarks(filtered);
	}, [bookmarks, searchQuery, selectedCategory]);

	const handleDelete = async (id: number) => {
		try {
			const { error } = await supabase.from("bookmarks").delete().eq("id", id);

			if (error) {
				throw error;
			}

			setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
			toast.success("🗑️ Bookmark berhasil dihapus");
		} catch (error) {
			console.error("Error deleting bookmark:", error);
			toast.error("❌ Gagal menghapus bookmark");
		}
	};

	const getUniqueCategories = () => {
		const categories = new Set<string>();
		bookmarks.forEach((bookmark) => {
			bookmark.tags?.forEach((tag) => categories.add(tag));
		});
		return Array.from(categories);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4 animate-spin" />
				<p className="text-gray-400 text-lg">Memuat bookmark...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filter Component */}
			<BookmarkFilter
				searchQuery={searchQuery}
				selectedCategory={selectedCategory}
				availableCategories={getUniqueCategories()}
				filteredCount={filteredBookmarks.length}
				totalCount={bookmarks.length}
				onSearchChange={setSearchQuery}
				onCategoryChange={setSelectedCategory}
			/>

			{/* Bookmarks Grid */}
			<div className="space-y-4">
				{filteredBookmarks.length === 0 ? (
					<div className="text-center py-12 md:py-16">
						<div className="text-6xl md:text-8xl mb-4 md:mb-6 opacity-20">
							📚
						</div>
						<h3 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">
							{searchQuery || selectedCategory !== "all"
								? "Tidak ada bookmark yang ditemukan"
								: "Belum ada bookmark"}
						</h3>
						<p className="text-sm md:text-base text-gray-500">
							{searchQuery || selectedCategory !== "all"
								? "Coba ubah filter atau kata kunci pencarian"
								: 'Klik tombol "Tambah Bookmark Baru" untuk memulai'}
						</p>
					</div>
				) : (
					<div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
						{filteredBookmarks.map((bookmark) => (
							<div
								key={bookmark.id}
								className="opacity-0 animate-fadeIn"
								style={{
									animationDelay: "0.1s",
									animationFillMode: "forwards",
								}}>
								<BookmarkCard
									bookmark={bookmark}
									onDelete={handleDelete}
									index={0}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
