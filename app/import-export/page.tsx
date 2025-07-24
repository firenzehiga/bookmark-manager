"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
	ArrowUpTrayIcon,
	ArrowDownTrayIcon,
	DocumentIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ImportResult {
	success: number;
	failed: number;
	errors: string[];
}

export default function ImportExportPage() {
	const { user } = useAuth();
	const [importing, setImporting] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [importResult, setImportResult] = useState<ImportResult | null>(null);

	const handleExport = async () => {
		if (!user) return;

		try {
			setExporting(true);

			const { data: bookmarks, error } = await supabase
				.from("bookmarks")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) throw error;

			// Format data for export
			const exportData = {
				exported_at: new Date().toISOString(),
				total_bookmarks: bookmarks?.length || 0,
				bookmarks:
					bookmarks?.map((bookmark) => ({
						title: bookmark.title,
						url: bookmark.url,
						description: bookmark.description,
						tags: bookmark.tags,
						created_at: bookmark.created_at,
						updated_at: bookmark.update_at,
					})) || [],
			};

			// Create and download file
			const blob = new Blob([JSON.stringify(exportData, null, 2)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `bookmarks-export-${
				new Date().toISOString().split("T")[0]
			}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Export error:", error);
			alert("Gagal mengekspor bookmark");
		} finally {
			setExporting(false);
		}
	};

	const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file || !user) return;

		try {
			setImporting(true);
			setImportResult(null);

			const fileContent = await file.text();
			let importData;

			// Try to parse JSON
			try {
				importData = JSON.parse(fileContent);
			} catch {
				// Try to parse as browser bookmark HTML
				importData = parseBookmarkHTML(fileContent);
			}

			let bookmarksToImport = [];

			// Handle different import formats
			if (importData.bookmarks && Array.isArray(importData.bookmarks)) {
				// Our export format
				bookmarksToImport = importData.bookmarks;
			} else if (Array.isArray(importData)) {
				// Array of bookmarks
				bookmarksToImport = importData;
			} else if (importData.roots) {
				// Chrome bookmark format
				bookmarksToImport = extractChromeBookmarks(importData);
			} else {
				throw new Error("Format file tidak didukung");
			}

			const result: ImportResult = {
				success: 0,
				failed: 0,
				errors: [],
			};

			// Import bookmarks one by one
			for (const bookmark of bookmarksToImport) {
				try {
					if (!bookmark.url || !bookmark.title) {
						result.failed++;
						result.errors.push(
							`Bookmark tanpa URL atau title: ${bookmark.title || "Unknown"}`
						);
						continue;
					}

					const { error } = await supabase.from("bookmarks").insert({
						title: bookmark.title,
						url: bookmark.url,
						description: bookmark.description || "",
						tags: bookmark.tags || [],
						user_id: user.id,
					});

					if (error) {
						result.failed++;
						result.errors.push(
							`Error importing "${bookmark.title}": ${error.message}`
						);
					} else {
						result.success++;
					}
				} catch (error) {
					result.failed++;
					result.errors.push(`Error importing "${bookmark.title}": ${error}`);
				}
			}

			setImportResult(result);
		} catch (error) {
			console.error("Import error:", error);
			alert(`Gagal mengimpor: ${error}`);
		} finally {
			setImporting(false);
			// Clear the input
			event.target.value = "";
		}
	};

	const parseBookmarkHTML = (html: string) => {
		// Simple HTML bookmark parser for browser exports
		const bookmarks = [];
		const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
		let match;

		while ((match = linkRegex.exec(html)) !== null) {
			bookmarks.push({
				url: match[1],
				title: match[2],
				description: "",
				tags: [],
			});
		}

		return bookmarks;
	};

	const extractChromeBookmarks = (
		data: Record<string, unknown>
	): Record<string, unknown>[] => {
		const bookmarks: Record<string, unknown>[] = [];

		const extractFromFolder = (folder: Record<string, unknown>) => {
			if (folder.children && Array.isArray(folder.children)) {
				folder.children.forEach((item: Record<string, unknown>) => {
					if (item.type === "url") {
						bookmarks.push({
							title: item.name,
							url: item.url,
							description: "",
							tags: [],
						});
					} else if (item.type === "folder") {
						extractFromFolder(item);
					}
				});
			}
		};

		if (data.roots && typeof data.roots === "object") {
			Object.values(data.roots).forEach((root: unknown) => {
				if (root && typeof root === "object") {
					extractFromFolder(root as Record<string, unknown>);
				}
			});
		}

		return bookmarks;
	};

	const exportToHTML = async () => {
		if (!user) return;

		try {
			setExporting(true);

			const { data: bookmarks, error } = await supabase
				.from("bookmarks")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) throw error;

			// Create HTML format (compatible with browsers)
			const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
${bookmarks
	?.map(
		(bookmark) => `
    <DT><A HREF="${bookmark.url}" ADD_DATE="${Math.floor(
			new Date(bookmark.created_at).getTime() / 1000
		)}">${bookmark.title}</A>
    ${bookmark.description ? `<DD>${bookmark.description}` : ""}
`
	)
	.join("")}
</DL><p>`;

			const blob = new Blob([html], { type: "text/html" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `bookmarks-${
				new Date().toISOString().split("T")[0]
			}.html`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("HTML Export error:", error);
			alert("Gagal mengekspor ke HTML");
		} finally {
			setExporting(false);
		}
	};

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-black text-white p-8">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<Link
							href="/bookmarks"
							className="text-blue-400 hover:text-blue-300">
							<ArrowLeftIcon className="w-6 h-6" />
						</Link>
						<DocumentIcon className="w-8 h-8 text-blue-400" />
						<h1 className="text-3xl font-bold">Import & Export</h1>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Export Section */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-gray-900 rounded-lg p-6 border border-gray-800">
							<div className="flex items-center gap-3 mb-6">
								<ArrowUpTrayIcon className="w-6 h-6 text-green-400" />
								<h2 className="text-xl font-semibold">Export Bookmarks</h2>
							</div>

							<p className="text-gray-400 mb-6">
								Download semua bookmark Anda dalam format JSON atau HTML
							</p>

							<div className="space-y-4">
								<button
									onClick={handleExport}
									disabled={exporting}
									className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
									{exporting ? (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									) : (
										<ArrowUpTrayIcon className="w-4 h-4" />
									)}
									{exporting ? "Mengekspor..." : "Export ke JSON"}
								</button>

								<button
									onClick={exportToHTML}
									disabled={exporting}
									className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
									{exporting ? (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									) : (
										<DocumentIcon className="w-4 h-4" />
									)}
									{exporting ? "Mengekspor..." : "Export ke HTML"}
								</button>
							</div>
						</motion.div>

						{/* Import Section */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-gray-900 rounded-lg p-6 border border-gray-800">
							<div className="flex items-center gap-3 mb-6">
								<ArrowDownTrayIcon className="w-6 h-6 text-blue-400" />
								<h2 className="text-xl font-semibold">Import Bookmarks</h2>
							</div>

							<p className="text-gray-400 mb-6">
								Upload file bookmark dalam format JSON atau HTML dari browser
							</p>

							<div className="space-y-4">
								<div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
									<ArrowDownTrayIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
									<p className="text-gray-400 mb-4">Pilih file untuk diimpor</p>
									<input
										type="file"
										accept=".json,.html,.htm"
										onChange={handleImport}
										disabled={importing}
										className="hidden"
										id="import-file"
									/>
									<label
										htmlFor="import-file"
										className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
										{importing ? (
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										) : (
											<DocumentIcon className="w-4 h-4" />
										)}
										{importing ? "Mengimpor..." : "Pilih File"}
									</label>
								</div>

								<div className="text-sm text-gray-500">
									<p>Format yang didukung:</p>
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>JSON (export dari aplikasi ini)</li>
										<li>HTML (export dari Chrome, Firefox, Safari)</li>
										<li>JSON (format Chrome bookmark)</li>
									</ul>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Import Results */}
					{importResult && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
							<h3 className="text-xl font-semibold mb-4">Hasil Import</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div className="flex items-center gap-3 text-green-400">
									<CheckCircleIcon className="w-6 h-6" />
									<span>Berhasil: {importResult.success} bookmark</span>
								</div>

								{importResult.failed > 0 && (
									<div className="flex items-center gap-3 text-red-400">
										<ExclamationTriangleIcon className="w-6 h-6" />
										<span>Gagal: {importResult.failed} bookmark</span>
									</div>
								)}
							</div>

							{importResult.errors.length > 0 && (
								<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
									<h4 className="text-red-400 font-medium mb-2">
										Error Details:
									</h4>
									<div className="text-sm text-red-300 space-y-1 max-h-32 overflow-y-auto">
										{importResult.errors.map((error, index) => (
											<div key={index}>• {error}</div>
										))}
									</div>
								</div>
							)}
						</motion.div>
					)}
				</div>
			</div>
		</ProtectedRoute>
	);
}
