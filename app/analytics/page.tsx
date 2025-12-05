"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import {
	ChartBarIcon,
	BookmarkIcon,
	TagIcon,
	CalendarIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftCircleIcon } from "lucide-react";
import { AnalyticsData } from "@/types/analytics";

import AnalyticSkeleton from "@/components/shared/skeleton/AnalyticSkeleton";

export default function AnalyticsPage() {
	const { user } = useAuth();
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user && !analytics) {
			fetchAnalytics();
		}
	}, [user]); // eslint-disable-line react-hooks/exhaustive-deps

	const fetchAnalytics = async () => {
		try {
			setLoading(true);

			// Get total bookmarks
			const { data: allBookmarks, error: totalError } = await supabase
				.from("bookmarks")
				.select("*")
				.eq("user_id", user?.id);

			if (totalError) throw totalError;

			// Get bookmarks this month
			const currentMonth = new Date();
			currentMonth.setDate(1);
			const { data: monthlyBookmarks, error: monthlyError } = await supabase
				.from("bookmarks")
				.select("*")
				.eq("user_id", user?.id)
				.gte("created_at", currentMonth.toISOString());

			if (monthlyError) throw monthlyError;

			// Process tags
			const tagCounts: { [key: string]: number } = {};
			allBookmarks?.forEach((bookmark) => {
				bookmark.tags?.forEach((tag: string) => {
					tagCounts[tag] = (tagCounts[tag] || 0) + 1;
				});
			});

			const topTags = Object.entries(tagCounts)
				.map(([tag, count]) => ({ tag, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5);

			// Monthly stats (last 6 months)
			const monthlyStats = [];
			for (let i = 5; i >= 0; i--) {
				const date = new Date();
				date.setMonth(date.getMonth() - i);
				const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
				const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

				const { data: monthData } = await supabase
					.from("bookmarks")
					.select("id")
					.eq("user_id", user?.id)
					.gte("created_at", monthStart.toISOString())
					.lte("created_at", monthEnd.toISOString());

				monthlyStats.push({
					month: date.toLocaleDateString("id-ID", {
						month: "short",
						year: "numeric",
					}),
					count: monthData?.length || 0,
				});
			}

			// Process domains
			const domainCounts: { [key: string]: number } = {};
			allBookmarks?.forEach((bookmark) => {
				try {
					const url = new URL(bookmark.url);
					const domain = url.hostname.replace("www.", "");
					domainCounts[domain] = (domainCounts[domain] || 0) + 1;
				} catch {
					// Skip invalid URLs
				}
			});

			const topDomains = Object.entries(domainCounts)
				.map(([domain, count]) => ({ domain, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 8);

			setAnalytics({
				totalBookmarks: allBookmarks?.length || 0,
				bookmarksThisMonth: monthlyBookmarks?.length || 0,
				topTags,
				monthlyStats,
				topDomains,
			});
		} catch (error) {
			console.error("Error fetching analytics:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProtectedRoute>
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
				<div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="text-center mb-8">
					<h2 className="text-3xl font-bold text-white mb-2">
						Analytics Dashboard
					</h2>
					<p className="text-gray-400">
						Monitoring penggunaan bookmark Anda dengan diagram dan statistik
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<div className="glass-dark rounded-2xl p-6 mb-8 border border-gray-700/50">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
									<ChartBarIcon className="w-8 h-8 text-indigo-400" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
										Analytics Dashboard
									</h1>
									<p className="text-gray-400 mt-1">
										Lihat statistik penggunaan bookmark Anda
									</p>
								</div>
							</div>

							<div className="flex gap-3">
								<Link
									href="/bookmarks"
									className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all">
									<ArrowLeftCircleIcon className="w-5 h-5" />
									Kembali ke Bookmarks
								</Link>
							</div>
						</div>
					</div>
				</motion.div>

				{loading ? (
					<AnalyticSkeleton />
				) : analytics ? (
					<div className="space-y-8">
						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="glass-dark rounded-2xl p-6 border border-gray-700/50">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-blue-500/20 rounded-xl">
										<BookmarkIcon className="w-6 h-6 text-blue-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm font-medium">
											Total Bookmarks
										</p>
										<p className="text-2xl font-bold text-white">
											{analytics.totalBookmarks}
										</p>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className="glass-dark rounded-2xl p-6 border border-gray-700/50">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-green-500/20 rounded-xl">
										<CalendarIcon className="w-6 h-6 text-green-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm font-medium">
											Bulan Ini
										</p>
										<p className="text-2xl font-bold text-white">
											{analytics.bookmarksThisMonth}
										</p>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="glass-dark rounded-2xl p-6 border border-gray-700/50">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-purple-500/20 rounded-xl">
										<TagIcon className="w-6 h-6 text-purple-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm font-medium">
											Total Tags
										</p>
										<p className="text-2xl font-bold text-white">
											{analytics.topTags.length}
										</p>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="glass-dark rounded-2xl p-6 border border-gray-700/50">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-yellow-500/20 rounded-xl">
										<ArrowTrendingUpIcon className="w-6 h-6 text-yellow-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm font-medium">
											Rata-rata/Bulan
										</p>
										<p className="text-2xl font-bold text-white">
											{Math.round(
												analytics.monthlyStats.reduce(
													(acc, curr) => acc + curr.count,
													0
												) / analytics.monthlyStats.length
											)}
										</p>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Charts */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Monthly Stats - Donut Chart Style */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="glass-dark rounded-2xl p-6 border border-gray-700/50">
								<h3 className="text-xl font-semibold mb-6 text-white">
									Bookmark per Bulan
								</h3>
								<div className="relative flex items-center justify-center">
									{/* Donut Chart */}
									<div className="relative w-48 h-48">
										<svg
											className="w-48 h-48 transform -rotate-90"
											viewBox="0 0 100 100">
											{analytics.monthlyStats.map((stat, index) => {
												const total = analytics.monthlyStats.reduce(
													(acc, curr) => acc + curr.count,
													0
												);
												const percentage =
													total > 0 ? (stat.count / total) * 100 : 0;
												const strokeDasharray = `${percentage} ${
													100 - percentage
												}`;
												const strokeDashoffset = analytics.monthlyStats
													.slice(0, index)
													.reduce(
														(acc, curr) =>
															acc +
															(total > 0 ? (curr.count / total) * 100 : 0),
														0
													);

												const colors = [
													"stroke-blue-500",
													"stroke-indigo-500",
													"stroke-purple-500",
													"stroke-pink-500",
													"stroke-rose-500",
													"stroke-orange-500",
												];

												return (
													<motion.circle
														key={index}
														initial={{ strokeDasharray: "0 100" }}
														animate={{ strokeDasharray }}
														transition={{
															delay: 0.6 + index * 0.2,
															duration: 1,
														}}
														cx="50"
														cy="50"
														r="40"
														fill="none"
														strokeWidth="8"
														className={`${
															colors[index % colors.length]
														} opacity-80`}
														style={{
															strokeDashoffset: `-${strokeDashoffset}`,
														}}
													/>
												);
											})}
										</svg>
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="text-center">
												<div className="text-2xl font-bold text-white">
													{analytics.monthlyStats.reduce(
														(acc, curr) => acc + curr.count,
														0
													)}
												</div>
												<div className="text-sm text-gray-400">Total</div>
											</div>
										</div>
									</div>
									{/* Legend */}
									<div className="ml-8 space-y-2">
										{analytics.monthlyStats.map((stat, index) => {
											const colors = [
												"bg-blue-500",
												"bg-indigo-500",
												"bg-purple-500",
												"bg-pink-500",
												"bg-rose-500",
												"bg-orange-500",
											];
											return (
												<motion.div
													key={index}
													initial={{ opacity: 0, x: 20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.8 + index * 0.1 }}
													className="flex items-center gap-3">
													<div
														className={`w-3 h-3 rounded-full ${
															colors[index % colors.length]
														}`}
													/>
													<span className="text-sm text-gray-300 font-medium min-w-0">
														{stat.month}
													</span>
													<span className="text-sm font-bold text-white ml-auto">
														{stat.count}
													</span>
												</motion.div>
											);
										})}
									</div>
								</div>
							</motion.div>

							{/* Top Tags - Hexagon Style */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="glass-dark rounded-2xl p-6 border border-gray-700/50">
								<h3 className="text-xl font-semibold mb-6 text-white">
									Top Tags
								</h3>
								<div className="space-y-6">
									{analytics.topTags.map((tag, index) => {
										const maxCount = Math.max(
											...analytics.topTags.map((t) => t.count)
										);
										const size = 40 + (tag.count / maxCount) * 40; // Size between 40-80px
										const colors = [
											"from-purple-500 to-pink-500",
											"from-blue-500 to-cyan-500",
											"from-green-500 to-emerald-500",
											"from-yellow-500 to-orange-500",
											"from-red-500 to-rose-500",
										];

										return (
											<motion.div
												key={index}
												initial={{ opacity: 0, scale: 0 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{
													delay: 0.8 + index * 0.2,
													type: "spring",
												}}
												className="flex items-center gap-6">
												{/* Hexagon */}
												<div
													className="relative"
													style={{ width: size, height: size }}>
													<div
														className={`absolute inset-0 bg-gradient-to-br ${
															colors[index % colors.length]
														} rounded-xl transform rotate-45 opacity-20`}
														style={{ width: size, height: size }}
													/>
													<div
														className={`absolute inset-0 bg-gradient-to-br ${
															colors[index % colors.length]
														} rounded-lg opacity-60`}
														style={{
															width: size * 0.8,
															height: size * 0.8,
															top: size * 0.1,
															left: size * 0.1,
														}}
													/>
													<div className="absolute inset-0 flex items-center justify-center">
														<span className="text-white font-bold text-lg">
															{tag.count}
														</span>
													</div>
												</div>

												{/* Tag Info */}
												<div className="flex-1">
													<div className="text-white font-semibold text-lg mb-1">
														{tag.tag}
													</div>
													<div className="flex items-center gap-2">
														<div className="flex-1 bg-gray-800/50 rounded-full h-2 overflow-hidden">
															<motion.div
																initial={{ width: 0 }}
																animate={{
																	width: `${(tag.count / maxCount) * 100}%`,
																}}
																transition={{
																	delay: 1 + index * 0.1,
																	duration: 0.8,
																}}
																className={`bg-gradient-to-r ${
																	colors[index % colors.length]
																} h-full rounded-full`}
															/>
														</div>
														<span className="text-sm text-gray-400 font-medium min-w-0">
															{((tag.count / maxCount) * 100).toFixed(0)}%
														</span>
													</div>
												</div>
											</motion.div>
										);
									})}
								</div>
							</motion.div>
						</div>

						{/* Top Domains - Bar Chart */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="glass-dark rounded-2xl p-6 border border-gray-700/50">
							<h3 className="text-xl font-semibold mb-6 text-white">
								Domain yang Sering Disimpan
							</h3>
							<div className="space-y-4">
								{analytics.topDomains.map((domain, index) => {
									const maxCount = Math.max(
										...analytics.topDomains.map((d) => d.count)
									);
									const percentage =
										maxCount > 0 ? (domain.count / maxCount) * 100 : 0;

									const colors = [
										"from-cyan-500 to-blue-500",
										"from-blue-500 to-indigo-500",
										"from-indigo-500 to-purple-500",
										"from-purple-500 to-pink-500",
										"from-pink-500 to-rose-500",
										"from-rose-500 to-orange-500",
										"from-orange-500 to-yellow-500",
										"from-yellow-500 to-green-500",
									];

									return (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
											className="flex items-center gap-4 group hover:bg-gray-800/30 p-3 rounded-xl transition-all">
											{/* Rank Badge */}
											<div className="flex-shrink-0">
												<div
													className={`w-8 h-8 bg-gradient-to-br ${
														colors[index % colors.length]
													} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
													{index + 1}
												</div>
											</div>

											{/* Domain Info */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between mb-2">
													<span className="text-white font-semibold truncate group-hover:text-cyan-300 transition-colors">
														{domain.domain}
													</span>
													<span className="text-sm text-gray-400 font-medium ml-2">
														{domain.count} bookmark
														{domain.count > 1 ? "s" : ""}
													</span>
												</div>
												{/* Progress Bar */}
												<div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														animate={{ width: `${percentage}%` }}
														transition={{
															delay: 1 + index * 0.1,
															duration: 0.8,
															ease: "easeOut",
														}}
														className={`bg-gradient-to-r ${
															colors[index % colors.length]
														} h-full rounded-full shadow-sm`}
													/>
												</div>
											</div>

											{/* Percentage */}
											<div className="flex-shrink-0 text-right">
												<motion.span
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.2 + index * 0.1 }}
													className="text-sm font-bold text-gray-300">
													{percentage.toFixed(0)}%
												</motion.span>
											</div>
										</motion.div>
									);
								})}

								{analytics.topDomains.length === 0 && (
									<div className="text-center py-8 text-gray-400">
										<div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
											<svg
												className="w-8 h-8"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
												/>
											</svg>
										</div>
										<p>Belum ada bookmark tersimpan</p>
									</div>
								)}
							</div>

							{/* Summary */}
							{analytics.topDomains.length > 0 && (
								<div className="mt-6 pt-4 border-t border-gray-700/50">
									<div className="flex justify-between items-center text-sm">
										<div className="text-gray-400">
											Total Domain:{" "}
											<span className="text-white font-semibold">
												{analytics.topDomains.length}
											</span>
										</div>
										<div className="text-gray-400">
											Domain Teratas:{" "}
											<span className="text-white font-semibold">
												{analytics.topDomains[0]?.domain || "-"}
											</span>
										</div>
									</div>
								</div>
							)}
						</motion.div>
					</div>
				) : (
					<div className="text-center text-gray-400 py-12">
						<ChartBarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
						<p className="text-lg">Gagal memuat data analytics</p>
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
}
