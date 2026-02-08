"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	XMarkIcon,
	EnvelopeIcon,
	LockClosedIcon,
	UserPlusIcon,
	ArrowRightIcon,
	KeyIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import GoogleSignButton from "./GoogleSignButton";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type AuthMode = "login" | "register" | "forgot-password" | "reset-success";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
	const [mode, setMode] = useState<AuthMode>("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (mode === "forgot-password") {
			handleForgotPassword();
			return;
		}

		if (!email || !password) {
			toast.error("Email dan password wajib diisi!");
			return;
		}

		if (mode === "register" && password.length < 6) {
			toast.error("Password minimal 6 karakter!");
			return;
		}

		setLoading(true);
		try {
			if (mode === "login") {
				await signIn(email, password);
				toast.success("🎉 Berhasil login!");
			} else {
				await signUp(email, password);
				toast.success("🎉 Pendaftaran berhasil! Anda sudah login.");
			}
			onClose();
			resetForm();
		} catch (error: unknown) {
			console.error("Auth error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			if (mode === "login") {
				if (errorMessage.includes("Invalid login credentials")) {
					toast.error("❌ Email atau password salah");
				} else {
					toast.error("❌ Gagal masuk. Silakan coba lagi.");
				}
			} else {
				if (
					errorMessage.includes("already registered") ||
					errorMessage.includes("User already registered")
				) {
					toast.error("❌ Email sudah terdaftar");
				} else if (errorMessage.includes("Password should be at least")) {
					toast.error("❌ Password terlalu pendek");
				} else {
					toast.error("❌ Gagal mendaftar. Silakan coba lagi.");
				}
			}
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async () => {
		if (!email) {
			toast.error("Masukkan email Anda!");
			return;
		}

		setLoading(true);
		try {
			await resetPassword(email);
			setMode("reset-success");
		} catch (error: unknown) {
			console.error("Reset password error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			if (errorMessage.includes("User not found")) {
				toast.error("❌ Email tidak terdaftar");
			} else {
				toast.error("❌ Gagal mengirim email. Silakan coba lagi.");
			}
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
	};

	const handleClose = () => {
		onClose();
		resetForm();
		setMode("login");
	};

	const toggleMode = () => {
		setMode(mode === "login" ? "register" : "login");
		resetForm();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
				onClick={handleClose}>
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 30 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 30 }}
					transition={{ type: "spring", duration: 0.5 }}
					onClick={(e) => e.stopPropagation()}
					className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-4 sm:p-6 md:p-10 w-full max-w-md sm:max-w-lg shadow-2xl max-h-[85vh] sm:max-h-[95vh] overflow-y-auto">
					{/* Gradient Accent */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />

					{/* Close Button */}
					<button
						onClick={handleClose}
						className="absolute top-3 right-3 sm:top-6 sm:right-6 text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-gray-800/50 group">
						<XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
					</button>

					{/* Header with Icon */}
					<div className="text-center mb-4 sm:mb-6 md:mb-8">
						<motion.div
							animate={{
								rotate: [0, 10, -10, 0],
								scale: [1, 1.05, 1],
							}}
							transition={{ duration: 4, repeat: Infinity }}
							className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-3 sm:mb-6 hover:scale-110 transition-transform duration-300">
							{mode === "forgot-password" || mode === "reset-success" ? (
								<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
									{mode === "reset-success" ? (
										<CheckCircleIcon className="w-10 h-10 text-white" />
									) : (
										<KeyIcon className="w-10 h-10 text-white" />
									)}
								</div>
							) : (
								<img src="/images/logo.png" alt="Logo" className="w-18 h-18" />
							)}
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
							{mode === "login" && "Welcome Back"}
							{mode === "register" && "Create Account"}
							{mode === "forgot-password" && "Reset Password"}
							{mode === "reset-success" && "Check Your Email"}
						</motion.h2>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-gray-400 text-sm sm:text-base px-2 sm:px-0">
							{mode === "login" && "Sign in to access your bookmarks"}
							{mode === "register" &&
								"Join us and start organizing your bookmarks"}
							{mode === "forgot-password" &&
								"Enter your email to receive a password reset link"}
							{mode === "reset-success" &&
								"We've sent you a password reset link"}
						</motion.p>
					</div>

					{/* Reset Success Screen */}
					{mode === "reset-success" && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-6">
							<div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
								<CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
								<h3 className="text-lg font-semibold text-white mb-2">
									Email Sent Successfully!
								</h3>
								<p className="text-gray-400 text-sm">
									We've sent a password reset link to{" "}
									<span className="text-indigo-400 font-medium">{email}</span>
								</p>
							</div>

							<div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
								<h4 className="text-white font-medium mb-3 flex items-center gap-2">
									<span className="text-lg">📧</span>
									Next Steps:
								</h4>
								<ol className="text-sm text-gray-300 space-y-2">
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">1.</span>
										Check your email inbox
									</li>
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">2.</span>
										Click the reset password link
									</li>
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">3.</span>
										Enter your new password
									</li>
								</ol>
							</div>

							<button
								type="button"
								onClick={() => setMode("login")}
								className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold transition-all duration-300">
								Back to Sign In
							</button>
						</motion.div>
					)}

					{/* Auth Forms */}
					{mode !== "reset-success" && (
						<motion.form
							key={mode}
							initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3 }}
							onSubmit={handleSubmit}
							className="space-y-3 sm:space-y-5">
							{/* Email Input */}
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-300">
									<EnvelopeIcon className="w-4 h-4 text-indigo-400" />
									Email Address
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-500"
									placeholder="you@example.com"
								/>
							</div>

							{/* Password Input (hide for forgot-password) */}
							{mode !== "forgot-password" && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label className="flex items-center gap-2 text-sm font-medium text-gray-300">
											<LockClosedIcon className="w-4 h-4 text-indigo-400" />
											Password
										</label>
										{mode === "login" && (
											<button
												type="button"
												onClick={() => setMode("forgot-password")}
												className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
												Forgot Password?
											</button>
										)}
									</div>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={6}
										className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-500"
										placeholder="••••••••"
									/>
									{mode === "register" && (
										<p className="text-xs text-gray-500">
											Must be at least 6 characters
										</p>
									)}
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6">
								{loading ? (
									<>
										<Loader2 className="animate-spin h-5 w-5" />
										{mode === "login" && "Signing in..."}
										{mode === "register" && "Creating account..."}
										{mode === "forgot-password" && "Sending reset link..."}
									</>
								) : (
									<>
										{mode === "login" && (
											<>
												<ArrowRightIcon className="w-5 h-5" />
												Sign In
											</>
										)}
										{mode === "register" && (
											<>
												<UserPlusIcon className="w-5 h-5" />
												Create Account
											</>
										)}
										{mode === "forgot-password" && (
											<>
												<KeyIcon className="w-5 h-5" />
												Send Reset Link
											</>
										)}
									</>
								)}
							</button>

							{/* Separator & Google Sign In (hide for forgot-password) */}
							{mode !== "forgot-password" && (
								<>
									<div className="flex items-center gap-4 my-6">
										<div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
										<span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
											Or continue with
										</span>
										<div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
									</div>

									<GoogleSignButton
										onClick={async () => {
											try {
												setLoading(true);
												await signInWithGoogle();
												handleClose();
											} catch (error: unknown) {
												console.error("Google sign in error:", error);
												const message =
													error instanceof Error
														? error.message
														: String(error) || "Unknown error";
												toast.error(`❌ Gagal masuk dengan Google: ${message}`);
											} finally {
												setLoading(false);
											}
										}}
										disabled={loading}
										label={loading ? "Signing in..." : "Continue with Google"}
										size="md"
										variant="default"
										className="mx-auto w-full"
									/>
								</>
							)}

							{/* Toggle Mode */}
							<div className="text-center pt-4 border-t border-gray-700/50">
								{mode === "forgot-password" ? (
									<p className="text-sm text-gray-400">
										Remember your password?{" "}
										<button
											type="button"
											onClick={() => setMode("login")}
											className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors underline underline-offset-2">
											Sign in
										</button>
									</p>
								) : (
									<p className="text-sm text-gray-400">
										{mode === "login"
											? "Don't have an account?"
											: "Already have an account?"}{" "}
										<button
											type="button"
											onClick={toggleMode}
											className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors underline underline-offset-2">
											{mode === "login" ? "Sign up" : "Sign in"}
										</button>
									</p>
								)}
							</div>

							{/* Footer Info */}
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="text-center text-gray-500 text-xs pt-4">
								Stay tuned, this is still in development
							</motion.p>
						</motion.form>
					)}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
