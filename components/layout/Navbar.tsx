"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
	BookmarkIcon,
	TableCellsIcon,
	HomeIcon,
	Bars3Icon,
	XMarkIcon,
	UserCircleIcon,
	ArrowRightOnRectangleIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "../shared/AuthModal";

export function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const pathname = usePathname();
	const { user, signOut, loading } = useAuth();

	const handleSignOut = async () => {
		try {
			await signOut();
			setIsProfileOpen(false);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const navigation = [
		{ name: "Home", href: "/", icon: HomeIcon },
		{ name: "Grid View", href: "/bookmarks", icon: BookmarkIcon },
		{ name: "Table View", href: "/bookmarks/table", icon: TableCellsIcon },
	];

	if (loading) {
		return (
			<nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<div className="animate-pulse bg-gray-700 h-8 w-32 rounded"></div>
						</div>
						<div className="flex items-center">
							<div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
						</div>
					</div>
				</div>
			</nav>
		);
	}

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						{/* Logo */}
						<div className="flex items-center">
							<Link
								href="/"
								className="flex items-center gap-2 hover:opacity-80 transition-opacity">
								<motion.span
									whileHover={{ rotate: [0, -10, 10, 0] }}
									transition={{ duration: 0.5 }}
									className="text-2xl">
									📚
								</motion.span>
								<span className="text-xl font-bold gradient-text hidden sm:block">
									Bookmark Manager
								</span>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-4">
							{navigation.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.name}
										href={item.href}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
											isActive
												? "bg-indigo-600 text-white"
												: "text-gray-300 hover:text-white hover:bg-gray-700"
										}`}>
										<item.icon className="w-4 h-4" />
										{item.name}
									</Link>
								);
							})}
						</div>

						{/* User Menu */}
						<div className="flex items-center gap-4">
							{user ? (
								<div className="relative">
									<button
										onClick={() => setIsProfileOpen(!isProfileOpen)}
										className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors">
										<div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
											{user.email?.charAt(0).toUpperCase()}
										</div>
										<span className="hidden sm:block text-sm text-gray-300 max-w-32 truncate">
											{user.email}
										</span>
									</button>

									<AnimatePresence>
										{isProfileOpen && (
											<motion.div
												initial={{ opacity: 0, scale: 0.95, y: -10 }}
												animate={{ opacity: 1, scale: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.95, y: -10 }}
												className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1">
												<div className="px-4 py-3 border-b border-gray-700">
													<p className="text-sm text-gray-300">Masuk sebagai</p>
													<p className="text-sm font-medium text-white truncate">
														{user.email}
													</p>
												</div>
												<button
													onClick={() => setIsProfileOpen(false)}
													className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
													<UserCircleIcon className="w-4 h-4" />
													Profile
												</button>
												<button
													onClick={() => setIsProfileOpen(false)}
													className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
													<Cog6ToothIcon className="w-4 h-4" />
													Settings
												</button>
												<hr className="border-gray-700 my-1" />
												<button
													onClick={handleSignOut}
													className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors">
													<ArrowRightOnRectangleIcon className="w-4 h-4" />
													Sign Out
												</button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							) : (
								<button
									onClick={() => setShowAuthModal(true)}
									className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
									Masuk
								</button>
							)}

							{/* Mobile Menu Button */}
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
								{isMenuOpen ? (
									<XMarkIcon className="w-6 h-6" />
								) : (
									<Bars3Icon className="w-6 h-6" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden border-t border-gray-700 bg-gray-900/95 backdrop-blur-sm">
							<div className="px-4 py-4 space-y-2">
								{navigation.map((item) => {
									const isActive = pathname === item.href;
									return (
										<Link
											key={item.name}
											href={item.href}
											onClick={() => setIsMenuOpen(false)}
											className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all ${
												isActive
													? "bg-indigo-600 text-white"
													: "text-gray-300 hover:text-white hover:bg-gray-700"
											}`}>
											<item.icon className="w-5 h-5" />
											{item.name}
										</Link>
									);
								})}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</nav>

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</>
	);
}
