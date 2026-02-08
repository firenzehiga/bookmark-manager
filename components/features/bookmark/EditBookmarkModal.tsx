"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Bookmark } from "@/types/bookmark";
import { CategorySelector } from "../../shared/CategorySelector";
import { useUpdateBookmark } from "@/hooks/useBookmarks";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function EditBookmarkModal({
	bookmark,
	isOpen,
	onClose,
	onSaved,
}: {
	bookmark: Bookmark | null;
	isOpen: boolean;
	onClose: () => void;
	onSaved?: () => void;
}) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const update = useUpdateBookmark();

	useEffect(() => {
		if (bookmark) {
			setTitle(bookmark.title || "");
			setDescription(bookmark.description || "");
			setTags(bookmark.tags || []);
			setIsPublic(Boolean(bookmark.is_public));
		}
	}, [bookmark]);

	const handleSave = async () => {
		try {
			await update.mutateAsync({
				id: bookmark!.id,
				updates: { title, description, tags, is_public: isPublic },
			});
			onSaved?.();
			onClose();
		} catch (err) {
			toast.error("Gagal memperbarui bookmark");
		}
	};

	if (!isOpen || !bookmark) return null;

	const modal = (
		<div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="bg-gray-900 rounded-2xl w-full max-w-2xl p-6 border border-gray-700 max-h-[90vh] overflow-hidden">
				<div className="flex items-center gap-3 mb-4">
					<h3 className="text-lg font-semibold">Edit Bookmark</h3>
					<div className="ml-auto">
						<button
							onClick={onClose}
							className="  text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-gray-800/50 group">
							<XMarkIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
						</button>
					</div>
				</div>

				<div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
					<div>
						<label className="text-sm text-gray-300">Title</label>
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
						/>
					</div>

					<div>
						<label className="text-sm text-gray-300">Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
						/>
					</div>

					<div>
						<CategorySelector
							selectedTags={tags}
							onTagToggle={(tagId) =>
								setTags((prev) =>
									prev.includes(tagId)
										? prev.filter((t) => t !== tagId)
										: [...prev, tagId],
								)
							}
						/>
					</div>

					<div className="flex items-center gap-3">
						<label className="inline-flex items-center gap-2">
							<Switch
								checked={isPublic}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>,
									checked: boolean,
								) => setIsPublic(checked)}
								color="primary"
								inputProps={{ "aria-label": "controlled" }}
							/>
						</label>
						<span className="text-sm text-gray-300">
							{isPublic ? "Bookmark is Public" : "Bookmark is Private"}
						</span>
					</div>

					<div className="flex gap-2 justify-end">
						<button
							onClick={onClose}
							className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors">
							Cancel
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
							Save
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);

	if (typeof document === "undefined") return null;
	return createPortal(modal, document.body);
}
