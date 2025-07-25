"use client";
export default function BookmarkSkeleton() {
	return (
		<figure className="relative h-full w-72 overflow-hidden rounded-xl border p-5 bg-gray-900/60 border-purple-800/30">
			<div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
			<div className="flex flex-col gap-3 relative z-10">
				<div className="h-5 w-2/3 bg-gray-700 rounded mb-2" />
				<div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
				<div className="flex gap-2">
					<div className="h-4 w-12 bg-gray-700 rounded-full" />
					<div className="h-4 w-8 bg-gray-700 rounded-full" />
				</div>
				<div className="h-3 w-1/3 bg-gray-700 rounded mt-auto" />
			</div>
		</figure>
	);
}
