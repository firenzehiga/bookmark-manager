"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import Swal from "sweetalert2";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	updatePassword: (newPassword: string) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const hasInitialized = useRef(false);
	const lastAuthEvent = useRef<string | null>(null);
	const authEventTime = useRef<number>(0);

	useEffect(() => {
		// Get initial session with aggressive persistence
		const getSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) {
					setUser(session.user);
					hasInitialized.current = true;
				} else {
					// Try to refresh token if no active session
					const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
					if (refreshedSession) {
						setUser(refreshedSession.user);
					} else {
						setUser(null);
					}
				}
			} catch (error) {
				console.error("Error getting session:", error);
			} finally {
				// Set loading to false immediately
				setLoading(false);
				hasInitialized.current = true;
			}
		};

		getSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {

			const now = Date.now();
			const timeSinceLastEvent = now - authEventTime.current;

			setUser(session?.user ?? null);

			// Only show toasts for genuine auth events
			if (
				hasInitialized.current &&
				event !== lastAuthEvent.current &&
				timeSinceLastEvent > 1000 &&
				event !== "TOKEN_REFRESHED" // Ignore automatic token refresh
			) {
				// Debounce 1 second

				if (event === "SIGNED_IN") {
					toast.success("👋 Selamat datang!", { position: "top-left" });
				} else if (event === "SIGNED_OUT") {
					toast.success("👋 Sampai jumpa!", { position: "top-left" });
				}

				lastAuthEvent.current = event;
				authEventTime.current = now;
			}

			// Set loading to false immediately for smooth transitions
			if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
				setLoading(false);
			}
		});

		return () => subscription.unsubscribe();
	}, []);



	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			console.error("Sign up error:", error);
			throw error;
		}
	};

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Sign in error:", error);
			throw error;
		}
	};

	const signInWithGoogle = async () => {
		try {
			// Gunakan URL lengkap untuk redirect
			const redirectTo = `${window.location.origin}/auth/callback`;

			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: redirectTo,
					// Tambahkan scopes yang diperlukan
					scopes: 'email profile',
				},
			});

			if (error) {
				console.error("Google sign in error:", error);
				throw error;
			}

			// Jika berhasil, pengguna akan diarahkan ke halaman Google untuk login
			// Setelah login, mereka akan diarahkan kembali ke /auth/callback
			return;
		} catch (error) {
			console.error("Google sign in error:", error);
			throw error;
		}
	};

	const resetPassword = async (email: string) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/callback`,
		});

		if (error) {
			console.error("Reset password error:", error);
			throw error;
		}
	};

	const updatePassword = async (newPassword: string) => {
		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) {
			console.error("Update password error:", error);
			throw error;
		}
	};

	const signOut = async () => {
		try {
			// Clear user state immediately for better UX
			setUser(null);

			// Clear cached data
			if (typeof window !== "undefined") {
				localStorage.removeItem("supabase.auth.token");
			}

			// Sign out from Supabase
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Sign out error:", error);
				throw error;
			}

			// Redirect to home with smooth transition
			router.push("/");
		} catch (error) {
			console.error("Sign out error:", error);
			// Still redirect to home even if there's an error
			router.push("/");
			throw error;
		}
	};
	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				signUp,
				signIn,
				signInWithGoogle,
				resetPassword,
				updatePassword,
				signOut,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
