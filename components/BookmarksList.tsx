"use client";

import { useState, useMemo } from "react";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkFilter } from "./BookmarkFilter";
import { useBookmarks, useDeleteBookmark } from "@/hooks/useBookmarks";
import { motion } from "framer-motion";

export function BookmarksList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [visibleData, setVisibleData] = useState(6); // State to control how many bookmarks to show
	// favorites feature removed

	// ✅ Use React Query hooks
	const { data: bookmarks = [], isLoading, error } = useBookmarks();
	const deleteBookmarkMutation = useDeleteBookmark();

	// ✅ Memoized filtered bookmarks for performance
	const filteredBookmarks = useMemo(() => {
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

		// no favorites filtering

		return filtered;
	}, [bookmarks, searchQuery, selectedCategory]);

	const showMore = () => {
		setVisibleData(bookmarks.length); // Increase by 6 each time
	};

	const showLess = () => {
		setVisibleData(6); // Reset to initial 6 bookmarks
	};
	const handleDelete = async (id: number) => {
		deleteBookmarkMutation.mutate(id);
	};

	const getUniqueCategories = useMemo(() => {
		const categories = new Set<string>();
		bookmarks.forEach((bookmark) => {
			bookmark.tags?.forEach((tag) => categories.add(tag));
		});
		return Array.from(categories);
	}, [bookmarks]);

	// Hanya tampilkan loading jika benar-benar loading dan belum ada data
	if (isLoading && bookmarks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4 animate-spin" />
				<p className="text-gray-400 text-lg">Memuat bookmark...</p>
			</div>
		);
	}

	// Handle error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="text-6xl mb-4 opacity-20">❌</div>
				<h3 className="text-xl font-bold text-gray-300 mb-2">
					Gagal memuat bookmark
				</h3>
				<p className="text-gray-500">
					Coba refresh halaman atau cek koneksi internet
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filter Component */}
			<BookmarkFilter
				searchQuery={searchQuery}
				selectedCategory={selectedCategory}
				availableCategories={getUniqueCategories}
				filteredCount={filteredBookmarks.length}
				totalCount={bookmarks.length}
				onSearchChange={setSearchQuery}
				onCategoryChange={setSelectedCategory}
			/>

			{/* Favorites feature removed */}

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
								: 'Klik tombol "+" di kanan bawah untuk menambah bookmark'}
						</p>
					</div>
				) : (
					<div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
						{filteredBookmarks.slice(0, visibleData).map((bookmark, index) => (
							<BookmarkCard
								key={bookmark.id}
								bookmark={bookmark}
								onDelete={handleDelete}
								index={index}
							/>
						))}
					</div>
				)}

				{visibleData < filteredBookmarks.length ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="flex flex-col sm:flex-row gap-1 justify-center">
						<button
							onClick={showMore}
							className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 btn-hover">
							Show More
						</button>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="flex flex-col sm:flex-row gap-1 justify-center">
						<button
							onClick={showLess}
							className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 btn-hover">
							Show Less
						</button>
					</motion.div>
				)}
			</div>
		</div>
	);
}
