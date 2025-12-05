export interface AnalyticsData {
	totalBookmarks: number;
	bookmarksThisMonth: number;
	topTags: Array<{ tag: string; count: number }>;
	monthlyStats: Array<{ month: string; count: number }>;
	topDomains: Array<{ domain: string; count: number }>;
}