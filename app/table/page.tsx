"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Bookmark, BOOKMARK_CATEGORIES } from "@/types/bookmark";
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	TrashIcon,
	ArrowTopRightOnSquareIcon,
	EyeIcon,
	XMarkIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";
import TableSkeleton from "@/components/shared/skeleton/TableSkeleton";
import { ArrowLeftCircleIcon } from "lucide-react";
import {
	useBookmarks,
	useDeleteBookmark,
	useRefreshBookmarks,
} from "@/hooks/useBookmarks";

export default function BookmarksTablePage() {
	const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// ✅ Menggunakan custom hooks
	const { data: bookmarks = [], isLoading, isFetching } = useBookmarks();
	const deleteBookmark = useDeleteBookmark();
	const refreshBookmarks = useRefreshBookmarks();

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

	// ✅ Fungsi untuk delete bookmark
	const handleDelete = async (id: number) => {
		if (!confirm("Yakin ingin menghapus bookmark ini?")) return;

		// ✅ Menggunakan custom hook untuk delete
		deleteBookmark.mutate(id);
	};

	// ✅ Fungsi untuk refresh manual
	const handleRefresh = async () => {
		// console.log("🔄 Refresh button clicked");
		// console.log("Current bookmarks count:", bookmarks.length);
		// console.log("isFetching:", isFetching);

		try {
			// Invalidate cache dan trigger refetch
			refreshBookmarks();

			// console.log("✅ Refresh completed");
			toast.success("🔄 Data bookmark diperbarui!");
		} catch {
			// console.error("❌ Error refreshing bookmarks:", error);
			toast.error("❌ Gagal memperbarui data");
		}
	};

	const getUniqueCategories = () => {
		const categories = new Set<string>();
		bookmarks.forEach((bookmark) => {
			bookmark.tags?.forEach((tag) => categories.add(tag));
		});
		return Array.from(categories);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const truncateUrl = (url: string, maxLength: number = 40) => {
		return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
	};

	return (
		<ProtectedRoute redirectToHome={true}>
			<div className="min-h-screen py-8 px-4">
				{/* Background Effect */}
				<div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
				<div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center mb-8">
						<h2 className="text-3xl font-bold text-white mb-2">
							📊 Tabel Bookmark
						</h2>
						<p className="text-gray-400">
							Kelola bookmark Anda dalam format tabel yang responsif
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}>
						<div className="glass-dark rounded-2xl p-6 mb-8 border border-gray-700/50">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
								<div>
									<h1 className="text-3xl font-bold text-white mb-2">
										Tabel Bookmark
									</h1>
									<p className="text-gray-400">
										Kelola bookmark Anda dalam format tabel yang responsif
									</p>
								</div>

								<div className="flex gap-3">
									<button
										onClick={handleRefresh}
										disabled={isFetching}
										className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all">
										{isFetching ? (
											<>
												<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
												Refreshing...
											</>
										) : (
											<>
												<ArrowPathIcon className="w-5 h-5" />
												Refresh
											</>
										)}
									</button>

									<Link
										href="/bookmarks"
										className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all">
										<ArrowLeftCircleIcon className="w-5 h-5" />
										Kembali
									</Link>
								</div>
							</div>
						</div>
					</motion.div>

					{isLoading ? (
						<TableSkeleton />
					) : (
						<div className="space-y-8">
							{/* Search and Filter */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}>
								<div className="glass-dark rounded-2xl p-4 md:p-6 mb-6 border border-gray-700/50">
									<div className="flex flex-col sm:flex-row gap-3 md:gap-4">
										{/* Search Input */}
										<div className="flex-1 relative">
											<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												type="text"
												placeholder="Cari bookmark..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
											/>
										</div>

										{/* Category Filter */}
										<div className="relative">
											<FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
											<select
												value={selectedCategory}
												onChange={(e) => setSelectedCategory(e.target.value)}
												className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-48">
												<option value="all">Semua Kategori</option>
												{getUniqueCategories().map((categoryId) => {
													const category = BOOKMARK_CATEGORIES.find(
														(c) => c.id === categoryId
													);
													return (
														<option key={categoryId} value={categoryId}>
															{category
																? `${category.icon} ${category.label}`
																: categoryId}
														</option>
													);
												})}
											</select>
										</div>
									</div>

									{/* Stats */}
									<div className="mt-4 flex items-center justify-between text-sm text-gray-400">
										<span>
											Menampilkan {filteredBookmarks.length} dari{" "}
											{bookmarks.length} bookmark
										</span>

										{/* Cache Status */}
										<div className="flex items-center gap-2">
											{isFetching && (
												<span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
													🔄 Memuat ulang...
												</span>
											)}
											{!isLoading && !isFetching && (
												<span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
													📚 Data tersimpan di cache
												</span>
											)}
											{deleteBookmark.isPending && (
												<span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded-full">
													🗑️ Menghapus...
												</span>
											)}
										</div>
									</div>
								</div>
							</motion.div>

							{/* Table */}
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}>
								<div className="glass-dark rounded-2xl border border-gray-700/50 overflow-hidden">
									{filteredBookmarks.length === 0 ? (
										<div className="text-center py-16">
											<div className="text-6xl mb-6 opacity-20">📚</div>
											<h3 className="text-2xl font-bold text-gray-300 mb-2">
												{searchQuery || selectedCategory !== "all"
													? "Tidak ada bookmark yang ditemukan"
													: "Belum ada bookmark"}
											</h3>
											<p className="text-gray-500">
												{searchQuery || selectedCategory !== "all"
													? "Coba ubah filter atau kata kunci pencarian"
													: 'Klik tombol "Tambah Bookmark Baru" untuk memulai'}
											</p>
										</div>
									) : (
										<div className="overflow-x-auto">
											<table className="w-full">
												<thead className="bg-gray-800/50 border-b border-gray-700">
													<tr>
														<th className="text-left p-4 text-gray-300 font-semibold">
															Judul
														</th>
														<th className="text-left p-4 text-gray-300 font-semibold hidden md:table-cell">
															URL
														</th>
														<th className="text-left p-4 text-gray-300 font-semibold hidden lg:table-cell">
															Kategori
														</th>
														<th className="text-left p-4 text-gray-300 font-semibold hidden xl:table-cell">
															Tanggal
														</th>
														<th className="text-center p-4 text-gray-300 font-semibold">
															Aksi
														</th>
													</tr>
												</thead>
												<tbody>
													{filteredBookmarks.map((bookmark, index) => (
														<tr
															key={bookmark.id}
															className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
															style={{
																animation: `fadeIn 0.3s ease-out ${
																	index * 0.05
																}s both`,
															}}>
															{/* Title & Description */}
															<td className="p-4">
																<div className="space-y-1">
																	<h3 className="font-semibold text-white text-sm md:text-base line-clamp-2">
																		{bookmark.title}
																	</h3>
																	{bookmark.description && (
																		<p className="text-gray-400 text-xs md:text-sm line-clamp-2">
																			{bookmark.description}
																		</p>
																	)}
																	{/* Mobile: Show URL and categories here */}
																	<div className="md:hidden space-y-2 mt-2">
																		<a
																			href={bookmark.url}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1">
																			{truncateUrl(bookmark.url, 30)}
																			<ArrowTopRightOnSquareIcon className="w-3 h-3" />
																		</a>
																		{bookmark.tags &&
																			bookmark.tags.length > 0 && (
																				<div className="flex flex-wrap gap-1">
																					{bookmark.tags
																						.slice(0, 2)
																						.map((tagId) => {
																							const category =
																								BOOKMARK_CATEGORIES.find(
																									(c) => c.id === tagId
																								);
																							return category ? (
																								<span
																									key={tagId}
																									className="text-xs px-2 py-1 rounded-full border"
																									style={{
																										backgroundColor: `${category.color}20`,
																										borderColor: `${category.color}40`,
																										color: category.color,
																									}}>
																									{category.icon}{" "}
																									{category.label}
																								</span>
																							) : null;
																						})}
																					{bookmark.tags.length > 2 && (
																						<span className="text-xs text-gray-500">
																							+{bookmark.tags.length - 2}
																						</span>
																					)}
																				</div>
																			)}
																	</div>
																</div>
															</td>

															{/* URL - Hidden on mobile */}
															<td className="p-4 hidden md:table-cell">
																<div className="flex items-center gap-2">
																	<a
																		href={bookmark.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 max-w-xs">
																		<span className="truncate">
																			{truncateUrl(bookmark.url, 35)}
																		</span>
																		<ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
																	</a>
																</div>
															</td>

															{/* Categories - Hidden on mobile and tablet */}
															<td className="p-4 hidden lg:table-cell">
																{bookmark.tags && bookmark.tags.length > 0 ? (
																	<div className="flex flex-wrap gap-1">
																		{bookmark.tags.slice(0, 2).map((tagId) => {
																			const category = BOOKMARK_CATEGORIES.find(
																				(c) => c.id === tagId
																			);
																			return category ? (
																				<span
																					key={tagId}
																					className="text-xs px-2 py-1 rounded-full border"
																					style={{
																						backgroundColor: `${category.color}20`,
																						borderColor: `${category.color}40`,
																						color: category.color,
																					}}>
																					{category.icon} {category.label}
																				</span>
																			) : null;
																		})}
																		{bookmark.tags.length > 2 && (
																			<span className="text-xs text-gray-500">
																				+{bookmark.tags.length - 2}
																			</span>
																		)}
																	</div>
																) : (
																	<span className="text-gray-500 text-sm">
																		-
																	</span>
																)}
															</td>

															{/* Date - Hidden on mobile, tablet, and small desktop */}
															<td className="p-4 hidden xl:table-cell">
																<span className="text-gray-400 text-sm">
																	{formatDate(bookmark.created_at)}
																</span>
															</td>

															{/* Actions */}
															<td className="p-4">
																<div className="flex items-center justify-center gap-2">
																	<button
																		onClick={() => setPreviewUrl(bookmark.url)}
																		className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/20 rounded-lg transition-all"
																		title="Preview">
																		<EyeIcon className="w-4 h-4" />
																	</button>
																	<button
																		onClick={() => handleDelete(bookmark.id)}
																		className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
																		title="Hapus">
																		<TrashIcon className="w-4 h-4" />
																	</button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}
								</div>
							</motion.div>
						</div>
					)}

					{/* Preview Modal */}
					{previewUrl && (
						<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
							<div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
								<div className="flex items-center justify-between p-4 border-b border-gray-700">
									<h3 className="text-lg font-semibold text-white">
										Preview Website
									</h3>
									<button
										onClick={() => setPreviewUrl(null)}
										className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
										<XMarkIcon className="w-5 h-5" />
									</button>
								</div>
								<div className="p-4">
									<div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
										<ArrowTopRightOnSquareIcon className="w-4 h-4" />
										<span className="truncate">{previewUrl}</span>
										<a
											href={previewUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-indigo-400 hover:text-indigo-300 ml-auto flex-shrink-0">
											Buka di tab baru
										</a>
									</div>
									<iframe
										src={previewUrl}
										className="w-full h-96 rounded-lg border border-gray-600"
										title="Website Preview"
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</ProtectedRoute>
	);
}
