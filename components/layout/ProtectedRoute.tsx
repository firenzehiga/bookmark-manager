"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	redirectToHome?: boolean; // Option to redirect to home
}

export function ProtectedRoute({
	children,
	fallback,
	redirectToHome = false,
}: ProtectedRouteProps) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user && redirectToHome) {
			// Immediate redirect to home if no user and redirectToHome is true
			router.replace("/");
			return;
		}
	}, [loading, user, redirectToHome, router]);

	// Show loading only briefly
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-slate-900 via-purple-900 to-slate-900">
				<div className="text-center">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
						className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></motion.div>
					<p className="text-indigo-200">Memverifikasi sesi...</p>
				</div>
			</div>
		);
	}

	// If user is not logged in and we're set to redirect, return null while redirecting
	if (!user && redirectToHome) {
		return null;
	}

	if (!user) {
		return (
			fallback || (
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-slate-900 via-purple-900 to-slate-900">
					<div className="text-center max-w-md mx-auto p-6">
						<div className="text-6xl mb-4">🔒</div>
						<h2 className="text-2xl font-bold text-white mb-2">
							Login Required
						</h2>
						<p className="text-gray-400 mb-6">
							Silakan login untuk mengakses halaman ini dan mengelola bookmark
							Anda
						</p>
						<div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
							<p className="text-sm text-gray-300">
								Untuk menggunakan Bookmark Manager, Anda perlu:
							</p>
							<ul className="text-sm text-gray-400 mt-2 space-y-1 text-left">
								<li>• Klik tombol &ldquo;Masuk&rdquo; di navbar</li>
								<li>• Daftar akun baru atau login</li>
								<li>• Verifikasi email dengan kode yang dikirim</li>
							</ul>
						</div>
					</div>
				</div>
			)
		);
	}

	return <>{children}</>;
}
