"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	UserCircleIcon,
	ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";

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
		try {
			setIsSigningOut(true);
			setIsProfileOpen(false);
			await signOut();
		} catch (error) {
			console.error("Error signing out:", error);
			setIsSigningOut(false);
		}
	};

	// Only show loading spinner saat isSigningOut, bukan saat initial loading
	if (isSigningOut) {
		return (
			<div className="fixed top-4 right-4 z-50">
				<div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-xl">
					<div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
					<span className="hidden sm:block text-sm">Keluar...</span>
				</div>
			</div>
		);
	}

	// Show skeleton button saat loading initial
	if (loading) {
		return (
			<div className="fixed top-4 right-4 z-50">
				<div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 text-transparent px-6 py-2 rounded-xl animate-pulse">
					<span className="opacity-0">Masuk</span>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="fixed top-4 right-4 z-50">
				{user ? (
					<div className="relative">
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800/90 transition-all duration-200 shadow-lg">
							<UserCircleIcon className="w-5 h-5" />
							<span className="hidden sm:block">
								{user.email?.split("@")[0]}
							</span>
						</button>

						<AnimatePresence>
							{isProfileOpen && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95, y: -10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95, y: -10 }}
									className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden">
									<div className="p-3 border-b border-gray-700">
										<p className="text-sm font-medium text-white truncate">
											{user.email}
										</p>
										<p className="text-xs text-gray-400">
											{user.user_metadata?.full_name || "User"}
										</p>
									</div>

									<div className="py-1">
										<button
											onClick={handleSignOut}
											disabled={isSigningOut}
											className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors disabled:opacity-50">
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
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
					>
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
