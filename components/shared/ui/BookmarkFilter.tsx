import React from "react";
import { MagnifyingGlassIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BOOKMARK_CATEGORIES } from "@/types/bookmark";
import { Search } from "lucide-react";

// Dark theme untuk MUI
const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			paper: "rgba(31, 41, 55, 0.5)",
		},
		text: {
			primary: "#ffffff",
			secondary: "#9ca3af",
		},
		primary: {
			main: "#6366f1",
		},
	},
	components: {
		MuiSelect: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(75, 85, 99, 1)",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(99, 102, 241, 0.5)",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "#6366f1",
						borderWidth: "2px",
					},
					borderRadius: "12px",
					backgroundColor: "rgba(31, 41, 55, 0.5)",
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "#9ca3af",
					"&.Mui-focused": {
						color: "#6366f1",
					},
					"&.MuiInputLabel-shrink": {
						color: "#6366f1",
					},
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(31, 41, 55, 0.8)",
					"&:hover": {
						backgroundColor: "rgba(55, 65, 81, 0.8)",
					},
					"&.Mui-selected": {
						backgroundColor: "rgba(99, 102, 241, 0.2)",
						"&:hover": {
							backgroundColor: "rgba(99, 102, 241, 0.3)",
						},
					},
				},
			},
		},
	},
});

interface BookmarkFilterProps {
	searchQuery: string;
	selectedCategory: string;
	availableCategories: string[];
	filteredCount: number;
	totalCount: number;
	onSearchChange: (query: string) => void;
	onCategoryChange: (category: string) => void;
}

export function BookmarkFilter({
	searchQuery,
	selectedCategory,
	availableCategories,
	filteredCount,
	totalCount,
	onSearchChange,
	onCategoryChange,
}: BookmarkFilterProps) {
	const handleCategoryChange = (event: SelectChangeEvent) => {
		onCategoryChange(event.target.value);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<div className="glass-dark rounded-2xl p-4 md:p-6 border border-gray-700/50">
				<div className="flex flex-col sm:flex-row gap-3 md:gap-4">
					{/* Search Input */}
					<div className="flex-1 relative">
						<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 z-10" />
						<input
							type="text"
							placeholder="Cari bookmark..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
						/>
					</div>

					{/* Category Filter with MUI */}
					<FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
						<InputLabel id="category-select-label">Kategori</InputLabel>
						<Select
							labelId="category-select-label"
							id="category-select"
							value={selectedCategory}
							onChange={handleCategoryChange}
							label="Kategori"
							size="small"
							sx={{
								height: { xs: "44px", md: "48px" },
								fontSize: { xs: "14px", md: "16px" },
							}}>
							<MenuItem value="all">
								<span className="flex items-center gap-2">
									<Search size={20} /> <span>Semua Kategori</span>
								</span>
							</MenuItem>
							{availableCategories.map((categoryId) => {
								const category = BOOKMARK_CATEGORIES.find(
									(c) => c.id === categoryId
								);
								if (!category) return null;

								return (
									<MenuItem key={categoryId} value={categoryId}>
										<span className="flex items-center gap-2">
											<span>
												<category.icon size={20} />
											</span>
											<span>{category.label}</span>
										</span>
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>

				{/* Stats */}
				<div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
					<span className="flex items-center gap-1">
						<BookmarkIcon className="w-3 h-3 md:w-4 md:h-4" />
						{filteredCount} dari {totalCount} bookmark
					</span>
					{searchQuery && (
						<span className="truncate">
							• Pencarian: &ldquo;{searchQuery}&rdquo;
						</span>
					)}
					{selectedCategory !== "all" && (
						<span className="truncate">
							•{" "}
							{BOOKMARK_CATEGORIES.find((c) => c.id === selectedCategory)
								?.label || selectedCategory}
						</span>
					)}
				</div>
			</div>
		</ThemeProvider>
	);
}
