"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LockClosedIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { updatePassword } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Verify that we have a valid session/token
        // Supabase automatically handles the token from the URL
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Semua field wajib diisi!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password minimal 6 karakter!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Password tidak cocok!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await updatePassword(newPassword);
            setSuccess(true);
            toast.success("🎉 Password berhasil diubah!");

            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error: unknown) {
            console.error("Update password error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";

            setError("Gagal mengubah password. Link mungkin sudah expired.");
            toast.error("❌ Gagal mengubah password");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 w-full max-w-md shadow-2xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 mb-6 shadow-lg shadow-green-500/40">
                        <CheckCircleIcon className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                        Password Updated!
                    </h2>
                    <p className="text-gray-400 text-base mb-6">
                        Your password has been successfully updated. You can now sign in with your new password.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Loader2 className="animate-spin h-4 w-4" />
                        Redirecting to homepage...
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 w-full max-w-md shadow-2xl">
                {/* Gradient Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-6 shadow-lg shadow-indigo-500/40">
                        <LockClosedIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                        Set New Password
                    </h2>
                    <p className="text-gray-400 text-base">
                        Enter your new password below
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 text-sm font-medium">Error</p>
                            <p className="text-red-300 text-xs mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* New Password Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <LockClosedIcon className="w-4 h-4 text-indigo-400" />
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-500"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-500">
                            Must be at least 6 characters
                        </p>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <LockClosedIcon className="w-4 h-4 text-indigo-400" />
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6">
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Updating password...
                            </>
                        ) : (
                            <>
                                <LockClosedIcon className="w-5 h-5" />
                                Update Password
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    After updating, you'll be redirected to sign in
                </p>
            </motion.div>
        </div>
    );
}
