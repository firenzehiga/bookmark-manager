'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarkIcon, SparklesIcon, RocketLaunchIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import ShinyText from "@/components/ShinyText";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bookmark, BOOKMARK_CATEGORIES } from "@/types/bookmark";

export default function Home() {
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const features = [
    { icon: "📱", title: "Responsif", desc: "Bekerja di semua device" },
    { icon: "🎨", title: "Modern UI", desc: "Design yang elegan dan interaktif" },
    { icon: "⚡", title: "Real-time", desc: "Data tersimpan langsung di cloud" },
    { icon: "🔍", title: "Pencarian", desc: "Temukan bookmark dengan mudah" },
  ];

  useEffect(() => {
    fetchRecentBookmarks();
  }, []);

  const fetchRecentBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching bookmarks:', error);
        return;
      }

      setRecentBookmarks(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisit = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
			<div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
			{/* <SplashCursor /> */}

			{/* Floating Elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<motion.div
					animate={{
						x: [0, 100, 0],
						y: [0, -100, 0],
						rotate: [0, 180, 360],
					}}
					transition={{ duration: 20, repeat: Infinity }}
					className="absolute top-20 left-20 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"
				/>
				<motion.div
					animate={{
						x: [0, -50, 0],
						y: [0, 100, 0],
						rotate: [0, -180, -360],
					}}
					transition={{ duration: 25, repeat: Infinity }}
					className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
				/>
			</div>

			<div className="relative z-10 flex items-center justify-center min-h-screen p-4">
				<div className="max-w-4xl w-full">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-12">
						{/* Logo Animation */}
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="flex items-center justify-center gap-4 mb-5">
							<motion.div
								animate={{
									rotate: [0, 10, -10, 0],
									scale: [1, 1.1, 1],
								}}
								transition={{ duration: 4, repeat: Infinity }}
								className="text-7xl">
								📚
							</motion.div>
							<div className="text-left">
								<h1 className="text-5xl font-bold gradient-text leading-tight">
									Bookmark
								</h1>
								<h1 className="text-5xl font-bold gradient-text leading-tight">
									Manager
								</h1>
							</div>
						</motion.div>

						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
							Simpan, kelola, dan temukan kembali link penting Anda dengan
							<span className="text-indigo-400 font-semibold">
								{" "}
								mudah
							</span>
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className="flex flex-col sm:flex-row gap-4 justify-center mb-7">
							<Link href="/bookmarks" className="group relative">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
									<BookmarkIcon className="w-5 h-5 flex-shrink-0" />
									<ShinyText
										text="Mulai Sekarang"
										disabled={false}
										speed={5}
										className="font-semibold whitespace-nowrap"
									/>
									<RocketLaunchIcon className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
								</motion.div>
							</Link>
						</motion.div>
					</motion.div>

				
					{/* Recent Bookmarks Section */}
					{!isLoading && recentBookmarks.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.6 }}
							className="mb-16">
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold text-white mb-2">
									🔖 Bookmark Terbaru
								</h2>
								<p className="text-gray-400">
									Akses cepat ke link yang baru-baru ini Anda simpan
								</p>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{recentBookmarks.map((bookmark, index) => (
									<motion.div
										key={bookmark.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.8 + index * 0.1 }}
										className="glass-dark rounded-xl p-4 border border-gray-700/50 hover:border-indigo-400/50 transition-all duration-300 group cursor-pointer"
										onClick={() => handleVisit(bookmark.url)}>
										
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1 min-w-0">
												<h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-indigo-300 transition-colors">
													{bookmark.title}
												</h3>
												<p className="text-xs text-gray-500 mt-1">
													{getDomainFromUrl(bookmark.url)} • {formatDate(bookmark.created_at)}
												</p>
											</div>
											<ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-2" />
										</div>
										
										{bookmark.description && (
											<p className="text-gray-400 text-xs line-clamp-2 mb-3">
												{bookmark.description}
											</p>
										)}
										
										{bookmark.tags && bookmark.tags.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{bookmark.tags.slice(0, 2).map(tagId => {
													const category = BOOKMARK_CATEGORIES.find(c => c.id === tagId);
													return category ? (
														<span
															key={tagId}
															className="text-xs px-2 py-1 rounded-full border"
															style={{
																backgroundColor: `${category.color}15`,
																borderColor: `${category.color}40`,
																color: category.color
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
										)}
									</motion.div>
								))}
							</div>
							
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 2.2 }}
								className="text-center mt-8">
								<Link
									href="/bookmarks"
									className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
									Lihat Semua Bookmark
									<ArrowTopRightOnSquareIcon className="w-4 h-4" />
								</Link>
							</motion.div>
						</motion.div>
					)}

					{/* Empty State for Bookmarks */}
					{!isLoading && recentBookmarks.length === 0 && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.6 }}
							className="mb-16 text-center">
							<div className="glass-dark rounded-2xl p-8 border border-gray-700/50">
								<div className="text-5xl mb-4 opacity-50">📚</div>
								<h3 className="text-xl font-semibold text-white mb-2">
									Belum Ada Bookmark
								</h3>
								<p className="text-gray-400 mb-6">
									Mulai simpan link favorit Anda untuk akses yang lebih mudah
								</p>
								<Link
									href="/bookmarks"
									className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
									<BookmarkIcon className="w-4 h-4" />
									Tambah Bookmark Pertama
								</Link>
							</div>
						</motion.div>
					)}

					{/* Call to Action */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.8 }}
						className="text-center mt-10">
						<div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
							<SparklesIcon className="w-5 h-5 text-indigo-400" />
							<span>Powered by Next.js, TypeScript & Supabase</span>
							<SparklesIcon className="w-5 h-5 text-indigo-400" />
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
