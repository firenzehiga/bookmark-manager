"use client";

import { motion } from "framer-motion";
import { BOOKMARK_CATEGORIES } from "@/types/bookmark";
import { CheckIcon } from "@heroicons/react/24/solid";

interface CategorySelectorProps {
	selectedTags: string[];
	onTagToggle: (tagId: string) => void;
	singleSelect?: boolean;
	showTags?: boolean;
}

export function CategorySelector({
	selectedTags,
	onTagToggle,
	singleSelect = false,
	showTags = true,
}: CategorySelectorProps) {
	return (
		<div className="space-y-3">
			<label className="block text-sm font-medium text-gray-300">
				Kategori Bookmark
			</label>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
				{BOOKMARK_CATEGORIES.map((category, index) => (
					<motion.button
						key={category.id}
						type="button"
						disabled={
							!singleSelect &&
							selectedTags.length >= 2 &&
							!selectedTags.includes(category.id)
						}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							// In singleSelect mode, parent will replace the selection with this id (or clear if same)
							onTagToggle(category.id);
						}}
						className={`
              relative p-2 rounded-xl border-2 transition-all duration-300 group
              ${
								selectedTags.includes(category.id)
									? "border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/25"
									: selectedTags.length >= 2 &&
									  !selectedTags.includes(category.id)
									? "border-gray-600 bg-gray-500/20 cursor-not-allowed"
									: "border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50"
							}
            `}>
						<div className="text-center">
							<div
								className={`text-2xl mb-1 ${
									selectedTags.includes(category.id)
										? "text-indigo-400"
										: selectedTags.length >= 2 &&
										  !selectedTags.includes(category.id)
										? "text-gray-500 opacity-15"
										: "text-gray-400"
								}`}>
								{category.icon}
							</div>
							<div
								className={`text-xs font-medium ${
									selectedTags.includes(category.id)
										? "text-gray-300"
										: selectedTags.length >= 2 &&
										  !selectedTags.includes(category.id)
										? "text-gray-400 opacity-15"
										: "text-gray-400 group-hover:text-white transition-colors"
								} `}>
								{category.label}
							</div>
						</div>

						{selectedTags.includes(category.id) && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="absolute -top-2 -right-2 bg-indigo-500 rounded-full p-1">
								<CheckIcon className="w-3 h-3 text-white" />
							</motion.div>
						)}
					</motion.button>
				))}
			</div>

			{showTags && selectedTags.length > 0 && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
					<p className="text-sm text-gray-400 mb-2">Kategori terpilih:</p>
					<div className="flex flex-wrap gap-2">
						{selectedTags.map((tagId) => {
							const category = BOOKMARK_CATEGORIES.find((c) => c.id === tagId);
							return category ? (
								<span
									key={tagId}
									className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs border border-indigo-400/30">
									<span>{category.icon}</span>
									<span>{category.label}</span>
								</span>
							) : null;
						})}
					</div>
				</motion.div>
			)}
		</div>
	);
}
