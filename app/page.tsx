/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { MoveCard } from "@/components/MoveCard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	BookmarkIcon,
	SparklesIcon,
	RocketLaunchIcon,
	ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import ShinyText from "@/components/ShinyText";
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bookmark, BOOKMARK_CATEGORIES } from "@/types/bookmark";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import Image from "next/image";
import SquaresEnhanced from "@/components/Squares";
export default function Home() {
	const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const { user, loading: authLoading } = useAuth();
	const [lastFetchedUserId, setLastFetchedUserId] = useState<string | null>(
		null
	);
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

	// const features = [
	//   { icon: "📱", title: "Responsif", desc: "Bekerja di semua device" },
	//   { icon: "🎨", title: "Modern UI", desc: "Design yang elegan dan interaktif" },
	//   { icon: "⚡", title: "Real-time", desc: "Data tersimpan langsung di cloud" },
	//   { icon: "🔍", title: "Pencarian", desc: "Temukan bookmark dengan mudah" },
	// ];

	const fetchRecentBookmarks = useCallback(async () => {
		try {
			// Only fetch if user is logged in
			if (!user) {
				setRecentBookmarks([]);
				setIsLoading(false);
				setLastFetchedUserId(null);
				setHasFetchedOnce(false);
				return;
			}

			// Prevent duplicate fetches for the same user
			if (hasFetchedOnce && lastFetchedUserId === user.id) {
				// console.log('Skipping fetch - already have data for user:', user.id);
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			//   console.log('Fetching bookmarks for user:', user.id);

			const { data, error } = await supabase
				.from("bookmarks")
				.select("*")
				.eq("user_id", user.id) // Filter by user_id
				.order("created_at", { ascending: false })
				.limit(3);

			//   if (error) {
			//     console.error('Error fetching bookmarks:', error);
			//     return;
			//   }

			//   console.log('Fetched bookmarks:', data);
			setRecentBookmarks(data || []);
			setLastFetchedUserId(user.id);
			setHasFetchedOnce(true);
		} catch (error) {
			//   console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}
	}, [user, hasFetchedOnce, lastFetchedUserId]);

	useEffect(() => {
		// Only fetch when user actually changes (login/logout)
		const currentUserId = user?.id || null;

		if (currentUserId !== lastFetchedUserId) {
			setHasFetchedOnce(false); // Reset the flag when user changes
			fetchRecentBookmarks();
		}
	}, [user?.id, lastFetchedUserId, fetchRecentBookmarks]);

	const handleStartNow = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			if (!user) {
				e.preventDefault();
				setShowAuthModal(true);
			}
			// Jika user ada, biarkan Link navigate normal
		},
		[user]
	);

	const handleAddFirstBookmark = useCallback(() => {
		if (user) {
			// User is logged in, navigate to bookmarks
			window.location.href = "/bookmarks";
		} else {
			// User not logged in, show auth modal
			setShowAuthModal(true);
		}
	}, [user]);

	const handleVisit = useCallback((url: string) => {
		window.open(url, "_blank", "noopener,noreferrer");
	}, []);

	const formatDate = useCallback((dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
		});
	}, []);

	const getDomainFromUrl = useCallback((url: string) => {
		try {
			return new URL(url).hostname.replace("www.", "");
		} catch {
			return url;
		}
	}, []);

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Background Layers - urutan penting! */}

			{/* 1. Base Background */}
			<div className="fixed inset-0 bg-black" />

			{/* 2. Animated Squares */}
			<div className="fixed inset-0 z-10 pointer-events-none">
				<SquaresEnhanced
					speed={0.5}
					squareSize={40}
					direction="up"
					borderColor="rgba(79, 70, 229, 0.5)"
					hoverFillColor="rgba(79, 70, 229, 0.2)"
					debug={false}
				/>
			</div>

			{/* 3. Gradient Overlay */}
			<div className="fixed inset-0 z-20 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 pointer-events-none" />

			{/* 4. Grid Pattern */}
			<div className="fixed inset-0 z-30 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.1))] opacity-20 pointer-events-none" />
			{/* <SplashCursor /> */}

			{/* Floating Elements */}
			<div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
				<motion.div
					animate={{
						x: [0, 100, 0],
						y: [0, -100, 0],
						rotate: [0, 180, 360],
					}}
					transition={{ duration: 20, repeat: Infinity }}
					className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
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

			<div className="relative z-50 flex items-center justify-center min-h-screen p-4">
				<div className="max-w-4xl w-full">
					{/* {authLoading ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className="w-12 h-12 rounded-full border-4 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 border-t-transparent mx-auto mb-4"></motion.div>
							<p className="text-indigo-200">Memverifikasi sesi...</p>
						</motion.div>
					) : ( */}
					<>
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
								className="flex items-center gap-3 justify-center mb-3">
								<motion.div
									animate={{
										rotate: [0, 10, -10, 0],
										scale: [1, 1.1, 1],
									}}
									transition={{ duration: 4, repeat: Infinity }}
									className="text-6xl">
									<Image
										src="/images/logo.png"
										alt="Logo"
										width={100}
										height={100}
									/>
								</motion.div>
								<div className="text-left">
									<h1 className="text-4xl font-bold text-indigo-400 leading-tight">
										Bookmark
									</h1>
									<h1 className="text-4xl font-bold text-indigo-400 leading-tight">
										Manager
									</h1>
								</div>
							</motion.div>

							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6 }}
								className="text-lg text-gray-300 mb-5 max-w-2xl mx-auto leading-relaxed">
								Simpan, kelola, dan temukan kembali link penting Anda dengan
								<span className="text-indigo-400 font-semibold"> mudah</span>
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8 }}
								className="flex flex-col sm:flex-row gap-1 justify-center">
								<Link
									href="/bookmarks"
									onClick={handleStartNow}
									className="group relative">
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

						{/* Recent Bookmarks Marquee */}
						<MoveCard />
						{/* Call to Action */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
							className="text-center mt-2">
							<div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
								<SparklesIcon className="w-5 h-5 text-indigo-400" />
								<span>Made with ❤️ | by @frenzehiga_</span>
								<SparklesIcon className="w-5 h-5 text-indigo-400" />
							</div>
						</motion.div>
					</>
					{/* )} */}
				</div>
			</div>

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
}
