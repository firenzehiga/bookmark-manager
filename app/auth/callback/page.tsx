"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function AuthCallback() {
	const router = useRouter();

	useEffect(() => {
		// Supabase akan secara otomatis memproses callback OAuth
		// Kita hanya perlu memeriksa session setelah komponen dimuat

		const checkSession = async () => {
			try {
				// Tunggu sejenak untuk memastikan session diproses oleh Supabase
				await new Promise((resolve) => setTimeout(resolve, 1000));

				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) {
					console.error("Auth callback error:", error);
					router.push("/?error=auth_failed");
					return;
				}

				if (session) {
					// User authenticated, redirect to bookmarks
					console.log("User authenticated:", session.user.email);
					router.push("/bookmarks");
				} else {
					// No session, redirect to home with error
					console.log("No session found");
					router.push("/?error=no_session");
				}
			} catch (error) {
				console.error("Error in auth callback:", error);
				router.push("/?error=auth_failed");
			}
		};

		checkSession();
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center max-w-md mx-auto p-8">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					className="flex justify-center mb-6">
					<div className="relative">
						<div className="w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-2xl font-bold text-white mb-2">
					Memproses Autentikasi
				</motion.h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="text-indigo-200 mb-6">
					Mohon tunggu sebentar, kami sedang memverifikasi akun Anda...
				</motion.p>

				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "100%" }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					className="h-2 bg-indigo-600 rounded-full overflow-hidden">
					<div className="h-full bg-white rounded-full"></div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className="mt-6 text-sm text-indigo-300">
					Mengarahkan Anda ke dashboard...
				</motion.div>
			</motion.div>
		</div>
	);
}
