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
	signUp: (
		email: string,
		password: string
	) => Promise<{ needsVerification: boolean }>;
	signIn: (email: string, password: string) => Promise<void>;
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
					setLoading(false);
					hasInitialized.current = true;
					return;
				}
				
				// Try to refresh token if no active session
				const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
				if (refreshedSession) {
					setUser(refreshedSession.user);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Error getting session:", error);
			} finally {
				setLoading(false);
				hasInitialized.current = true;
			}
		};

		getSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth event:", event, "Initialized:", hasInitialized.current);

			const now = Date.now();
			const timeSinceLastEvent = now - authEventTime.current;

			setUser(session?.user ?? null);
			setLoading(false);

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
		});

		return () => subscription.unsubscribe();
	}, []);

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${
					process.env.NODE_ENV === "production"
						? "https://bookmark-manager-neon.vercel.app"
						: window.location.origin
				}/auth/callback`,
			},
		});

		if (error) {
			console.error("Sign up error:", error);
			throw error;
		}

		// Jika email confirmation diperlukan
		if (data.user && !data.session) {
			return { needsVerification: true };
		}

		return { needsVerification: false };
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

	const signOut = async () => {
		try {
			// Set loading state untuk mencegah flash
			setLoading(true);

			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Sign out error:", error);
				setLoading(false);
				throw error;
			}

			// Clear user state
			setUser(null);

			// Clear cached data
			if (typeof window !== "undefined") {
				localStorage.removeItem("supabase.auth.token");
			}

			// Immediate redirect tanpa delay
			router.replace("/");
		} catch (error) {
			setLoading(false);
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
