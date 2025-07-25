"use client";

export default function AnalyticSkeleton() {
	return (
		<div className="space-y-8">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="relative glass-dark rounded-2xl p-6 border border-gray-700/50 overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />
						<div className="relative z-10 flex items-center gap-4">
							<div className="w-12 h-12 bg-gray-700 rounded-xl" />
							<div className="space-y-2 flex-1">
								<div className="h-4 w-2/3 bg-gray-700 rounded" />
								<div className="h-6 w-1/2 bg-gray-700 rounded" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Charts: Donut & Top Tags */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Donut Chart */}
				<div className="relative glass-dark rounded-2xl p-6 border border-gray-700/50 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />
					<div className="relative z-10">
						<div className="h-6 w-48 bg-gray-700 rounded mb-6" />
						<div className="flex items-center justify-center relative">
							<div className="w-48 h-48 rounded-full bg-gray-700/40" />
							<div className="ml-8 space-y-4">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex items-center gap-3">
										<div className="w-3 h-3 rounded-full bg-gray-700" />
										<div className="h-3 bg-gray-700 rounded w-16" />
										<div className="h-3 bg-gray-700 rounded w-10 ml-auto" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Top Tags Hexagons */}
				<div className="relative glass-dark rounded-2xl p-6 border border-gray-700/50 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />
					<div className="relative z-10">
						<div className="h-6 w-32 bg-gray-700 rounded mb-6" />
						<div className="space-y-6">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-center gap-6">
									<div className="w-12 h-12 bg-gray-700 rounded-lg" />
									<div className="flex-1 space-y-2">
										<div className="h-4 w-1/3 bg-gray-700 rounded" />
										<div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
											<div className="h-full w-1/2 bg-gray-700 rounded-full" />
										</div>
									</div>
									<div className="h-4 w-10 bg-gray-700 rounded" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Top Domains Bar Chart */}
			<div className="relative glass-dark rounded-2xl p-6 border border-gray-700/50 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />
				<div className="relative z-10">
					<div className="h-6 w-56 bg-gray-700 rounded mb-6" />
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/20">
								<div className="w-8 h-8 rounded-full bg-gray-700" />
								<div className="flex-1 space-y-2">
									<div className="flex justify-between items-center">
										<div className="h-4 w-1/2 bg-gray-700 rounded" />
										<div className="h-4 w-12 bg-gray-700 rounded" />
									</div>
									<div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
										<div className="h-full w-1/2 bg-gray-700 rounded-full" />
									</div>
								</div>
								<div className="h-4 w-8 bg-gray-700 rounded" />
							</div>
						))}
					</div>

					<div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between text-sm">
						<div className="h-4 w-32 bg-gray-700 rounded" />
						<div className="h-4 w-32 bg-gray-700 rounded" />
					</div>
				</div>
			</div>
		</div>
	);
}
