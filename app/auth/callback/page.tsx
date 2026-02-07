"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function AuthCallback() {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(true);

	useEffect(() => {
		const checkSession = async () => {
			try {
				// Parse URL hash for recovery token (Supabase sends it as #access_token=...)
				const hashParams = new URLSearchParams(window.location.hash.substring(1));
				const urlParams = new URLSearchParams(window.location.search);

				const type = urlParams.get("type") || hashParams.get("type");
				const error = urlParams.get("error");
				const errorDescription = urlParams.get("error_description");
				const accessToken = hashParams.get("access_token");
				const refreshToken = hashParams.get("refresh_token");

				console.log("Auth callback params:", { type, error, accessToken: !!accessToken });

				// Handle errors from Supabase
				if (error) {
					console.error("Auth callback error:", error, errorDescription);

					if (error === "access_denied" && errorDescription?.includes("expired")) {
						router.push("/?error=link_expired");
						return;
					}

					router.push("/?error=auth_failed");
					return;
				}

				// Password recovery flow - redirect to reset-password page
				if (type === "recovery" || (accessToken && window.location.hash.includes("type=recovery"))) {
					console.log("Password recovery detected - redirecting to reset-password page");

					// Set session with the tokens from URL
					if (accessToken && refreshToken) {
						await supabase.auth.setSession({
							access_token: accessToken,
							refresh_token: refreshToken,
						});
					}

					// Redirect to reset password page
					router.push("/reset-password");
					return;
				}

				// Normal OAuth/login flow
				await new Promise((resolve) => setTimeout(resolve, 500));

				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError) {
					console.error("Session error:", sessionError);
					router.push("/?error=auth_failed");
					return;
				}

				if (session) {
					console.log("User authenticated:", session.user.email);
					router.push("/bookmarks");
				} else {
					console.log("No session found");
					router.push("/?error=no_session");
				}
			} catch (error) {
				console.error("Error in auth callback:", error);
				router.push("/?error=auth_failed");
			} finally {
				setIsProcessing(false);
			}
		};

		checkSession();
	}, [router]);

	if (!isProcessing) {
		return null;
	}

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
					Mengarahkan Anda ke halaman yang tepat...
				</motion.div>
			</motion.div>
		</div>
	);
}
