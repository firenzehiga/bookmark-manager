import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import {
	ArrowTopRightOnSquareIcon,
	CalendarIcon,
} from "@heroicons/react/24/outline";
import BookmarkSkeleton from "@/components/skeleton/BookmarkSkeleton";

interface Bookmark {
	id: string;
	title: string;
	url: string;
	description?: string;
	tags?: string[];
	created_at: string;
	user_id: string;
}

const BookmarkCard = ({
	title,
	url,
	tags,
	created_at,
}: {
	title: string;
	url: string;
	tags?: string[];
	created_at: string;
}) => {
	const getDomainFromUrl = (url: string) => {
		try {
			return new URL(url).hostname.replace("www.", "");
		} catch {
			return url;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
		});
	};

	const handleVisit = () => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	return (
		<figure
			onClick={handleVisit}
			className={cn(
				"relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border p-5",
				"bg-gray-900/60 border-purple-800/30 hover:bg-purple-900/40 backdrop-blur-md",
				"transition-all duration-500 ease-out hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20",
				"hover:scale-105 transform group"
			)}>
			<div className="flex flex-col gap-3 relative z-10">
				{/* Header with Title and Visit Icon */}
				<div className="flex items-start justify-between">
					<h3 className="text-lg font-semibold text-white leading-tight truncate flex-1 group-hover:text-purple-100 transition-colors duration-300">
						{title}
					</h3>
					<ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300 flex-shrink-0 ml-2" />
				</div>

				{/* Domain */}
				<div className="text-sm text-purple-400 font-medium group-hover:text-purple-300 transition-colors duration-300">
					{getDomainFromUrl(url)}
				</div>

				{/* Tags */}
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{tags.slice(0, 3).map((tag, index) => (
							<span
								key={index}
								className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 group-hover:bg-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
								{tag}
							</span>
						))}
						{tags.length > 3 && (
							<span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
								+{tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Date */}
				<div className="flex items-center gap-2 text-xs text-gray-500 mt-auto group-hover:text-gray-400 transition-colors duration-300">
					<CalendarIcon className="w-3 h-3" />
					<span>{formatDate(created_at)}</span>
				</div>
			</div>

			{/* Enhanced Hover Effect with Purple Theme */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-indigo-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

			{/* Subtle glow effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-xl blur-sm" />
		</figure>
	);
};

export function MoveCard() {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [loading, setLoading] = useState(true);
	const { user, loading: authLoading } = useAuth(); // pastikan ada loading dari context

	useEffect(() => {
		const fetchRecentBookmarks = async () => {
			if (authLoading) return; // tunggu auth selesai
			if (!user) {
				setBookmarks([]);
				setLoading(false);
				return;
			}

			try {
				const { data, error } = await supabase
					.from("bookmarks")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false })
					.limit(10);

				if (error) throw error;
				setBookmarks(data || []);
			} catch (error) {
				console.error("Error fetching bookmarks:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRecentBookmarks();
	}, [user, authLoading]);

	return (
		<div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-2">
					Recent Bookmarks
				</h2>
				<p className="text-gray-400">Bookmark terbaru yang Anda simpan</p>
			</div>
			<div
				className="relative w-full flex justify-center min-h-[180px]" // min height biar stabil
				style={{
					maskImage:
						"linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 5%, black 15%, black 85%, rgba(0,0,0,0.2) 95%, transparent 100%)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 5%, black 15%, black 85%, rgba(0,0,0,0.2) 95%, transparent 100%)",
				}}>
				{loading ? (
					<Marquee pauseOnHover className="[--duration:60s]">
						{[...Array(3)].map((_, i) => (
							<BookmarkSkeleton key={i} />
						))}
					</Marquee>
				) : bookmarks.length === 0 ? (
					<div className="w-72 flex items-center justify-center text-gray-400 text-center mx-auto">
						Belum ada bookmark. Mulai simpan link favorit Anda!
					</div>
				) : (
					<Marquee pauseOnHover className="[--duration:60s]">
						{bookmarks.map((bookmark) => (
							<BookmarkCard key={bookmark.id} {...bookmark} />
						))}
					</Marquee>
				)}
			</div>
		</div>
	);
}
