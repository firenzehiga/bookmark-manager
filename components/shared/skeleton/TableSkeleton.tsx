"use client";

export default function TableSkeleton() {
	return (
		<div className="space-y-8">
			{/* Search & Filters */}
			<div className="glass-dark rounded-2xl p-4 md:p-6 mb-6 border border-gray-700/50 animate-pulse ">
				<div className="flex flex-col sm:flex-row gap-3 md:gap-4 h-[30px]">
					{/* Search Input Skeleton */}
					<div className="flex-1 relative">
						<div className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-xl" />
					</div>

					{/* Category Filter Skeleton */}
					<div className="relative min-w-48">
						<div className="pl-10 pr-8 py-3 bg-gray-700 rounded-xl w-full" />
					</div>
				</div>

				{/* Stats Skeleton */}
				<div className="mt-4 h-4 bg-gray-700 rounded w-1/2" />
			</div>
			{/* Table Skeleton */}
			<div className="overflow-x-auto animate-pulse glass-dark rounded-2xl border border-gray-700/50">
				<table className="w-full">
					<thead className="bg-gray-800/50 border-b border-gray-700">
						<tr>
							<th className="text-left p-4 text-gray-300 font-semibold"></th>
							<th className="text-left p-4 text-gray-300 font-semibold hidden md:table-cell"></th>
							<th className="text-left p-4 text-gray-300 font-semibold hidden lg:table-cell"></th>
							<th className="text-left p-4 text-gray-300 font-semibold hidden xl:table-cell"></th>
							<th className="text-center p-4 text-gray-300 font-semibold"></th>
						</tr>
					</thead>
					<tbody>
						{[...Array(5)].map((_, index) => (
							<tr key={index} className="border-b border-gray-700/50">
								{/* Judul */}
								<td className="p-4">
									<div className="space-y-2">
										<div className="h-4 bg-gray-700 rounded w-3/4" />
										<div className="h-3 bg-gray-700 rounded w-1/2" />
										{/* Mobile only extra (tags/URL) */}
										<div className="md:hidden space-y-2 mt-2">
											<div className="h-3 bg-gray-700 rounded w-2/3" />
											<div className="flex gap-2">
												<div className="h-4 w-16 bg-gray-700 rounded-full" />
												<div className="h-4 w-12 bg-gray-700 rounded-full" />
											</div>
										</div>
									</div>
								</td>

								{/* URL */}
								<td className="p-4 hidden md:table-cell">
									<div className="h-4 bg-gray-700 rounded w-4/5" />
								</td>

								{/* Kategori */}
								<td className="p-4 hidden lg:table-cell">
									<div className="flex gap-2">
										<div className="h-4 w-16 bg-gray-700 rounded-full" />
										<div className="h-4 w-12 bg-gray-700 rounded-full" />
									</div>
								</td>

								{/* Tanggal */}
								<td className="p-4 hidden xl:table-cell">
									<div className="h-4 w-20 bg-gray-700 rounded" />
								</td>

								{/* Aksi */}
								<td className="p-4 text-center">
									<div className="flex justify-center gap-2">
										<div className="h-8 w-8 bg-gray-700 rounded-lg" />
										<div className="h-8 w-8 bg-gray-700 rounded-lg" />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
