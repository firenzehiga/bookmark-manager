"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarksList } from "@/components/features/bookmark/BookmarksList";
import { AddBookmarkForm } from "@/components/features/bookmark/AddBookmarkForm";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ImportExportModal } from "@/components/shared/ui/ImportExportModal";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
	BookmarkIcon,
	PlusIcon,
	XMarkIcon,
	TableCellsIcon,
	ArrowLeftCircleIcon,
	ChartBarIcon,
	ArrowsRightLeftIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";

export default function BookmarksPage() {
	const [showAddForm, setShowAddForm] = useState(false);
	const [showImportExport, setShowImportExport] = useState(false);

	// Floating Dock Items
	const dockItems = [
		{
			title: "Home",
			icon: <HomeIcon className="w-6 h-6" />,
			href: "/",
		},
		{
			title: "Add Bookmark",
			icon: <PlusIcon className="w-6 h-6" />,
			href: "#",
		},
		{
			title: "Table View",
			icon: <TableCellsIcon className="w-6 h-6" />,
			href: "/table",
		},
		{
			title: "Analytics",
			icon: <ChartBarIcon className="w-6 h-6" />,
			href: "/analytics",
		},
		{
			title: "Import/Export",
			icon: <ArrowsRightLeftIcon className="w-6 h-6" />,
			href: "#",
		},
	];

	return (
		<ProtectedRoute redirectToHome={true}>
			<div className="min-h-screen py-8 px-4">
				{/* Background Effect */}
				<div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
				<div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />

				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="text-center mb-8">
						<div className="flex items-center justify-center gap-3 mb-4">
							<motion.div
								initial={{ rotate: -10, scale: 0.8 }}
								animate={{ rotate: 0, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}>
								<BookmarkIcon className="w-8 h-8 text-indigo-400" />
							</motion.div>
							<h1 className="text-3xl font-bold gradient-text">
								Data Bookmark
							</h1>
						</div>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="text-lg text-gray-300 mb-6">
							Temukan dan kelola link penting Anda
						</motion.p>

						{/* Floating Dock Navigation */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.4 }}
							className="flex justify-center mb-8">
							<FloatingDock
								items={dockItems.map((item) => ({
									...item,
									onClick:
										item.title === "Add Bookmark"
											? () => setShowAddForm(true)
											: item.title === "Import/Export"
												? () => setShowImportExport(true)
												: undefined,
								}))}
								desktopClassName="shadow-2xl"
							/>
						</motion.div>
					</motion.div>

					{/* Add Button & Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="mb-8">
						{showAddForm && (
							<AnimatePresence>
								<motion.div
									initial={{ opacity: 0, height: 0, y: -20 }}
									animate={{ opacity: 1, height: "auto", y: 0 }}
									exit={{ opacity: 0, height: 0, y: -20 }}
									transition={{ duration: 0.4, ease: "easeOut" }}
									className="overflow-hidden">
									<div className="max-w-2xl mx-auto">
										<div className="glass-dark rounded-2xl p-6 border border-gray-700/50 relative">
											<div className="flex items-center justify-between mb-6">
												<h2 className="text-xl font-bold text-white flex items-center gap-2">
													<PlusIcon className="w-5 h-5 text-indigo-400" />
													Tambah Bookmark Baru
												</h2>
												<motion.button
													onClick={() => setShowAddForm(false)}
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all">
													<XMarkIcon className="w-5 h-5" />
												</motion.button>
											</div>
											<AddBookmarkForm
												onSuccess={() => setShowAddForm(false)}
											/>
										</div>
									</div>
								</motion.div>
							</AnimatePresence>
						)}
					</motion.div>

					{/* Bookmarks List */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.6 }}>
						<BookmarksList />
					</motion.div>

					{/* Import/Export Modal */}
					<ImportExportModal
						isOpen={showImportExport}
						onClose={() => setShowImportExport(false)}
					/>
				</div>
			</div>
		</ProtectedRoute>
	);
}
