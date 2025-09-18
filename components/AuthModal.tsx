"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	XMarkIcon,
	EnvelopeIcon,
	LockClosedIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type AuthStep = "login" | "register" | "success";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
	const [step, setStep] = useState<AuthStep>("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { signIn, signUp, signInWithGoogle } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Email dan password wajib diisi!");
			return;
		}

		setLoading(true);
		try {
			await signIn(email, password);
			onClose();
			resetForm();
		} catch (error: unknown) {
			console.error("Login error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			if (errorMessage.includes("Invalid login credentials")) {
				toast.error("❌ Email atau password salah");
			} else if (errorMessage.includes("Email not confirmed")) {
				toast.error("📧 Silakan cek email untuk verifikasi akun Anda");
			} else {
				toast.error("❌ Gagal masuk. Silakan coba lagi.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Email dan password wajib diisi!");
			return;
		}

		if (password.length < 6) {
			toast.error("Password minimal 6 karakter!");
			return;
		}

		setLoading(true);
		try {
			const result = await signUp(email, password);
			if (result.needsVerification) {
				toast.success("📧 Link verifikasi telah dikirim ke email Anda!");
				setStep("success");
			} else {
				toast.success("🎉 Pendaftaran berhasil!");
				onClose();
				resetForm();
			}
		} catch (error: unknown) {
			console.error("Register error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			if (errorMessage.includes("already registered")) {
				toast.error("❌ Email sudah terdaftar");
			} else if (errorMessage.includes("Password should be at least")) {
				toast.error("❌ Password terlalu pendek");
			} else {
				toast.error("❌ Gagal mendaftar. Silakan coba lagi.");
			}
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setStep("login");
	};

	const handleClose = () => {
		onClose();
		resetForm();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 w-full max-w-md">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-white">
							{step === "login" && "🔐 Masuk"}
							{step === "register" && "📝 Daftar"}
							{step === "success" && "📧 Cek Email Anda"}
						</h2>
						<button
							onClick={handleClose}
							className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700">
							<XMarkIcon className="w-6 h-6" />
						</button>
					</div>

					{/* Login Form */}
					{step === "login" && (
						<motion.form
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							onSubmit={handleLogin}
							className="space-y-4">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-300">
									<EnvelopeIcon className="w-4 h-4" />
									Email
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									placeholder="nama@example.com"
								/>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-300">
									<LockClosedIcon className="w-4 h-4" />
									Password
								</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									placeholder="password Anda"
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
								{loading ? (
									<>
										<Loader2 className="animate-spin rounded-full h-5 w-5" />
										Sedang Masuk...
									</>
								) : (
									"Masuk"
								)}
							</button>

							{/* Google Sign In Button */}
							<button
								type="button"
								onClick={async () => {
									try {
										setLoading(true);
										await signInWithGoogle();
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
								className="w-full bg-white hover:bg-gray-300 text-gray-900 py-2 px-3 rounded-md font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
								<Image
									width={50}
									height={50}
									src="/images/google.png"
									alt="Google"
									className="w-10 h-10"
								/>
								Masuk dengan Google
							</button>

							<p className="text-center text-gray-400 text-sm">
								Belum punya akun?{" "}
								<button
									type="button"
									onClick={() => setStep("register")}
									className="text-indigo-400 hover:text-indigo-300 transition-colors underline">
									Daftar di sini
								</button>
							</p>
						</motion.form>
					)}

					{/* Register Form */}
					{step === "register" && (
						<motion.form
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							onSubmit={handleRegister}
							className="space-y-4">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-300">
									<EnvelopeIcon className="w-4 h-4" />
									Email Aktif
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									placeholder="nama@example.com"
								/>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-sm font-medium text-gray-300">
									<LockClosedIcon className="w-4 h-4" />
									Password
								</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={6}
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									placeholder="Minimal 6 karakter"
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-gradient-to-r hover:bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										Mendaftar...
									</>
								) : (
									<>
										<UserIcon className="w-5 h-5" />
										Daftar
									</>
								)}
							</button>

							{/* Google Sign In Button */}
							<button
								type="button"
								onClick={async () => {
									try {
										setLoading(true);
										await signInWithGoogle();
									} catch (error: unknown) {
										console.error("Google sign in error:", error);
										const message =
											error instanceof Error
												? error.message
												: String(error) || "Unknown error";
										toast.error(`❌ Gagal mendaftar dengan Google: ${message}`);
									} finally {
										setLoading(false);
									}
								}}
								disabled={loading}
								className="w-full bg-white text-gray-900 py-2 px-3 hover:bg-gray-300 rounded-md font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
								<Image
									width={50}
									height={50}
									src="/images/google.png"
									alt="Google"
									className="w-10 h-10"
								/>
								Daftar dengan Google
							</button>

							<p className="text-center text-gray-400 text-sm">
								Sudah punya akun?{" "}
								<button
									type="button"
									onClick={() => setStep("login")}
									className="text-indigo-400 hover:text-indigo-300 transition-colors underline">
									Masuk di sini
								</button>
							</p>
						</motion.form>
					)}

					{/* Success Message */}
					{step === "success" && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-6">
							<div className="text-center">
								<div className="text-6xl mb-4">�</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									Email Verifikasi Terkirim!
								</h3>
								<p className="text-gray-300 text-sm mb-4">
									Kami telah mengirim link verifikasi ke:
								</p>
								<p className="text-indigo-400 font-medium break-all mb-4">
									{email}
								</p>
							</div>

							<div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4">
								<h4 className="text-white font-medium mb-3 flex items-center gap-2">
									<span className="text-lg">📋</span>
									Langkah selanjutnya:
								</h4>
								<ol className="text-sm text-gray-300 space-y-2">
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">1.</span>
										Buka aplikasi email Anda
									</li>
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">2.</span>
										Cari email dari bookmark manager
									</li>
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">3.</span>
										Klik tombol &quot;Confirm your signup&quot; di dalam email
									</li>
									<li className="flex items-start gap-2">
										<span className="text-indigo-400 font-mono">4.</span>
										Anda akan dialihkan kembali ke aplikasi dan otomatis login
									</li>
								</ol>
							</div>

							<div className="text-center space-y-3">
								<p className="text-xs text-gray-400">
									Tidak menerima email? Cek folder spam
								</p>
								<button
									type="button"
									onClick={() => setStep("register")}
									className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
									← Kembali ke pendaftaran
								</button>
							</div>
						</motion.div>
					)}
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
