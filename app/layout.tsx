import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthButton } from "@/components/AuthButton";
import { QuickAddBookmark } from "@/components/QuickAddBookmark";
import { generateJSONLD, generateOrganizationJSONLD } from "@/lib/jsonld";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Bookmark Manager",
		default: "Bookmark Manager - Kelola Bookmark Dengan Mudah",
	},
	description:
		"Platform terbaik untuk menyimpan, mengorganisir, dan mengelola bookmark Anda. Fitur pencarian cerdas, kategorisasi otomatis, dan sinkronisasi cloud.",
	keywords: [
		"bookmark manager",
		"simpan bookmark",
		"kelola bookmark",
		"bookmark organizer",
		"save links",
		"bookmark tool",
		"web bookmark",
		"bookmark app",
		"link manager",
		"bookmark indonesia",
	],
	authors: [{ name: "Firenze Higa" }],
	creator: "Firenze Higa",
	publisher: "Bookmark Manager",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "id_ID",
		url: "https://bookmark-manager.vercel.app",
		siteName: "Bookmark Manager",
		title: "Bookmark Manager - Kelola Bookmark Dengan Mudah",
		description:
			"Platform terbaik untuk menyimpan, mengorganisir, dan mengelola bookmark Anda. Fitur pencarian cerdas, kategorisasi otomatis, dan sinkronisasi cloud.",
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "Bookmark Manager - Kelola Bookmark Dengan Mudah",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Bookmark Manager - Kelola Bookmark Dengan Mudah",
		description:
			"Platform terbaik untuk menyimpan, mengorganisir, dan mengelola bookmark Anda.",
		images: ["/images/og-image.png"],
		creator: "@firenzehiga",
	},
	verification: {
		google: "your-google-verification-code",
	},
	alternates: {
		canonical: "https://bookmark-manager.vercel.app",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const jsonLd = generateJSONLD();
	const organizationJsonLd = generateOrganizationJSONLD();

	return (
		<html lang="id" className="dark">
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationJsonLd),
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
				<QueryProvider>
					<AuthProvider>
						<main>
							{children}
							<AuthButton />
							<QuickAddBookmark />
						</main>
						<ToastProvider />
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
