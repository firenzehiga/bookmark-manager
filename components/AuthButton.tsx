"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	UserCircleIcon,
	ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import Swal from "sweetalert2";

export function AuthButton() {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const { user, signOut, loading } = useAuth();

	// Reset isSigningOut when user changes or loading changes
	useEffect(() => {
		if (!loading) {
			setIsSigningOut(false);
		}
	}, [loading, user]);

	const handleSignOut = async () => {
		const result = await Swal.fire({
			title: "Want to Sign Out?",
			width: 330,
			showCancelButton: true,
			confirmButtonText: "Yes, sign out",
			cancelButtonText: "Cancel",
			reverseButtons: true,
			backdrop: `
				url("/images/nyan-cat.gif")
				right 65rem bottom 20rem
				no-repeat
			`,
			customClass: {
				container: "swal-custom-backdrop",
			},
		});

		if (result.isConfirmed) {
			try {
				setIsSigningOut(true);
				setIsProfileOpen(false);

				// Tambahkan delay kecil untuk animasi
				await new Promise((resolve) => setTimeout(resolve, 500));
				await signOut();
			} catch (error) {
				console.error("Error signing out:", error);
				setIsSigningOut(false);
			}
		}
	};

	// Only show loading spinner saat isSigningOut, bukan saat initial loading
	if (isSigningOut) {
		return (
			<div className="fixed top-4 right-4 z-50">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex items-center gap-2  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-xl shadow-lg">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
						className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></motion.div>
					<span className="hidden sm:block text-sm">Keluar...</span>
				</motion.div>
			</div>
		);
	}

	// Show skeleton button saat loading initial
	if (loading) {
		return (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="fixed bottom-6 right-6 z-50">
					{/* Floating Action Button */}
					<div className="fixed top-4 right-4 z-50">
						<div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 text-transparent px-6 py-2 rounded-xl animate-pulse">
							<span className="opacity-0">Masuk</span>
						</div>
					</div>
					<button className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 text-transparent p-4 rounded-full shadow-lg animate-pulse">
						<UserCircleIcon className="w-6 h-6" />
					</button>
				</motion.div>
			</AnimatePresence>
		);
	}

	return (
		<>
			<div className="fixed top-4 right-4 z-50">
				{user ? (
					<div className="relative">
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8 }}
								className="">
								{/* Floating Action Button */}
								<button
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-sm border border-indigo-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800/90 transition-all duration-200 shadow-lg">
									<UserCircleIcon className="w-5 h-5" />
									<span className="hidden sm:block">
										{user.email?.split("@")[0]}
									</span>
								</button>
							</motion.div>
						</AnimatePresence>

						<AnimatePresence>
							{isProfileOpen && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95, y: -10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-500 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-lg overflow-hidden">
									<div className="p-3 border-b border-gray-600 bg-gradient-to-r from-indigo-600/80 to-purple-700/80">
										<p className="text-sm font-medium text-white truncate">
											{user.email}
										</p>
										<p className="text-xs text-blue-100 mt-2">
											{user.user_metadata?.full_name || "User"}
										</p>
									</div>

									<div className="py-1 bg-gradient-to-r from-indigo-700/60 to-purple-800/60">
										<button
											onClick={handleSignOut}
											disabled={isSigningOut}
											className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-red-500 hover:text-red-100 transition-colors disabled:opacity-50">
											<ArrowRightOnRectangleIcon className="w-4 h-4" />
											Keluar
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				) : (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}>
						<button
							onClick={() => setShowAuthModal(true)}
							className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
							Masuk
						</button>
					</motion.div>
				)}
			</div>

			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>

			{isProfileOpen && (
				<div
					className="fixed inset-0 z-40 lg:hidden"
					onClick={() => setIsProfileOpen(false)}
				/>
			)}
		</>
	);
}

export default AuthButton;
