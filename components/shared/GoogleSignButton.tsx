"use client";
import React from "react";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "outline";

interface Props {
	onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
	label?: string;
	size?: Size;
	variant?: Variant;
	disabled?: boolean;
	className?: string;
}

const sizes: Record<Size, string> = {
	sm: "px-3 py-1.5 text-sm gap-2 h-9",
	md: "px-4 py-2 text-base gap-3 h-11",
	lg: "px-5 py-3 text-lg gap-4 h-12",
};

export default function GoogleSignButton({
	onClick,
	label = "Sign in with Google",
	size = "md",
	variant = "default",
	disabled = false,
	className = "",
}: Props) {
	const sizeClasses = sizes[size] ?? sizes.md;
	const base = `inline-flex items-center justify-center rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses}`;
	const variantClasses =
		variant === "outline"
			? "bg-white border border-gray-300 hover:bg-gray-50 text-[#3c4043]"
			: "bg-white border border-transparent hover:bg-gray-50 text-[#3c4043]";

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className={`${base} ${variantClasses} ${className}`}>
			<span className="flex items-center">
				<svg
					className="h-5 w-5"
					viewBox="0 0 533.5 544.3"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden>
					<path
						fill="#4285F4"
						d="M533.5 278.4c0-18.5-1.6-36.2-4.6-53.4H272v101.1h147.4c-6.4 34.7-26 64.1-55.6 83.8v69.5h89.8c52.6-48.4 82.9-119.9 82.9-201z"
					/>
					<path
						fill="#34A853"
						d="M272 544.3c73.6 0 135.4-24.4 180.6-66.5l-89.8-69.5c-24.9 16.7-56.8 26.6-90.8 26.6-69.7 0-128.8-47.1-150-110.4H29.1v69.4C74.3 481.7 165.8 544.3 272 544.3z"
					/>
					<path
						fill="#FBBC05"
						d="M122 323.9c-10.9-32.5-10.9-67.5 0-100l-92.9-69.4C6.6 182.4 0 226.1 0 272c0 45.9 6.6 89.6 29.1 117.5l92.9-65.6z"
					/>
					<path
						fill="#EA4335"
						d="M272 107.7c39.9-.6 78.8 14.1 108.2 40.9l81.1-81.1C400.7 24.9 336.1 0 272 0 165.8 0 74.3 62.6 29.1 156.9l92.9 69.4C143.2 154.8 202.3 107.7 272 107.7z"
					/>
				</svg>
			</span>

			<span className="sr-only">{label}</span>
			<span className="ml-2">{label}</span>
		</button>
	);
}
