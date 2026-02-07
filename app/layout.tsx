import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/shared/ui/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthButton } from "@/components/shared/AuthButton";
import { QuickAddBookmark } from "@/components/shared/QuickAddBookmark";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="id" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
				<QueryProvider >
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
