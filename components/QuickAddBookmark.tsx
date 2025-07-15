/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, BookmarkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export function QuickAddBookmark() {
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const { user } = useAuth();

	// Prevent hydration mismatch
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Don't render until mounted
	if (!isMounted) {
		return null;
	}

	// Predefined tags
	const availableTags = [
		"Work",
		"Personal",
		"Tutorial",
		"News",
		"Entertainment",
		"Shopping",
		"Social Media",
		"Documentation",
		"Tools",
		"Design",
		"Programming",
		"Research",
		"Education",
		"Finance",
		"Health",
	];

	const extractTitle = async (url: string) => {
		try {
			// Try to fetch the page title
			const response = await fetch(
				`/api/extract-title?url=${encodeURIComponent(url)}`
			);
			if (response.ok) {
				const data = await response.json();
				return data.title || urlFallbackTitle(url);
			}
			return urlFallbackTitle(url);
		} catch {
			return urlFallbackTitle(url);
		}
	};

	const urlFallbackTitle = (url: string) => {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname.replace("www.", "") + urlObj.pathname;
		} catch {
			return url;
		}
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	const handleQuickAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!url.trim()) return;

		if (!user) {
			toast.error("Silakan login terlebih dahulu");
			return;
		}

		setIsLoading(true);
		try {
			const finalTitle = title.trim() || (await extractTitle(url));

			const { error } = await supabase.from("bookmarks").insert({
				title: finalTitle,
				url: url.trim(),
				tags: selectedTags,
				user_id: user.id,
				created_at: new Date().toISOString(),
			});

			if (error) throw error;

			toast.success("🔖 Bookmark berhasil ditambahkan!");
			setUrl("");
			setTitle("");
			setSelectedTags([]);
			setIsOpen(false);
		} catch (error) {
			console.error("Error adding bookmark:", error);
			toast.error("Gagal menambahkan bookmark");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasteFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (text.startsWith("http")) {
				setUrl(text);
				// Auto-extract title when URL is pasted
				if (!title.trim()) {
					const extractedTitle = await extractTitle(text);
					setTitle(extractedTitle);
				}
			}
		} catch (error) {
			console.log("Could not read clipboard");
		}
	};

	return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <PlusIcon className="w-6 h-6" />
      </motion.button>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <BookmarkIcon className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-semibold text-white">
                  Quick Add Bookmark
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ml-auto p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-purple-600 hover:to-blue-400 transition-all shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>

              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste URL here... (use Paste button)"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title (auto-extracted from URL)"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (pilih yang sesuai)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-2 text-sm text-gray-400">
                      Selected: {selectedTags.join(", ")}
                    </div>
                  )}
                </div>

                <div className="flex gap-20">
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    📋 Paste Url
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "..." : "Tambah"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
	);
}
