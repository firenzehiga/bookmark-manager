"use client";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { Bars3Icon } from "@heroicons/react/24/outline";
import {
	AnimatePresence,
	MotionValue,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";

import { useRef, useState } from "react";

export const FloatingDock = ({
	items,
	desktopClassName,
	mobileClassName,
}: {
	items: {
		title: string;
		icon: React.ReactNode;
		href: string;
		onClick?: () => void;
	}[];
	desktopClassName?: string;
	mobileClassName?: string;
}) => {
	return (
		<>
			<FloatingDockDesktop
				items={items}
				className={cn(desktopClassName, mobileClassName)}
			/>
		</>
	);
};

const FloatingDockMobile = ({
	items,
	className,
}: {
	items: {
		title: string;
		icon: React.ReactNode;
		href: string;
		onClick?: () => void;
	}[];
	className?: string;
}) => {
	const [open, setOpen] = useState(false);
	return (
		<div className={cn("block md:hidden", className)}>
			<AnimatePresence>
				{open && (
					<>
						{/* Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
							onClick={() => setOpen(false)}
						/>
						{/* Side Menu */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
							className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 border-r border-white/10 z-50 p-6">
							<div className="flex flex-col gap-4 mt-16">
								{items.map((item, idx) => (
									<motion.div
										key={item.title}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.1 }}>
										{item.onClick ? (
											<button
												onClick={() => {
													item.onClick!();
													setOpen(false);
												}}
												className="flex items-center gap-3 w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
												<div className="w-6 h-6">{item.icon}</div>
												<span className="font-medium">{item.title}</span>
											</button>
										) : (
											<a
												href={item.href}
												onClick={() => setOpen(false)}
												className="flex items-center gap-3 w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
												<div className="w-6 h-6">{item.icon}</div>
												<span className="font-medium">{item.title}</span>
											</a>
										)}
									</motion.div>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
			<AnimatePresence>
				<button
					onClick={() => setOpen(!open)}
					className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo/10 border border-white/20 hover:bg-black/20 transition-colors duration-150">
					<Bars3Icon className="h-6 w-6 text-white/80" />
				</button>
			</AnimatePresence>
		</div>
	);
};

const FloatingDockDesktop = ({
	items,
	className,
}: {
	items: {
		title: string;
		icon: React.ReactNode;
		href: string;
		onClick?: () => void;
	}[];
	className?: string;
}) => {
	let mouseX = useMotionValue(Infinity);
	return (
		<motion.div
			onMouseMove={(e) => mouseX.set(e.pageX)}
			onMouseLeave={() => mouseX.set(Infinity)}
			style={{ transform: "translate3d(0, 0, 0)" }}
			className={cn(
				"mx-auto flex h-16 items-end gap-4 rounded-2xl bg-black/20 border border-white/10 px-4 pb-3 shadow-2xl",
				className,
			)}>
			{items.map((item) => (
				<IconContainer mouseX={mouseX} key={item.title} {...item} />
			))}
		</motion.div>
	);
};

function IconContainer({
	mouseX,
	title,
	icon,
	href,
	onClick,
}: {
	mouseX: MotionValue;
	title: string;
	icon: React.ReactNode;
	href: string;
	onClick?: () => void;
}) {
	let ref = useRef<HTMLDivElement>(null);

	let distance = useTransform(mouseX, (val) => {
		let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

		return val - bounds.x - bounds.width / 2;
	});

	let widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
	let heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

	let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20]);
	let heightTransformIcon = useTransform(
		distance,
		[-150, 0, 150],
		[20, 30, 20],
	);

	let width = useSpring(widthTransform, {
		mass: 0.05,
		stiffness: 250,
		damping: 15,
	});
	let height = useSpring(heightTransform, {
		mass: 0.05,
		stiffness: 250,
		damping: 15,
	});

	let widthIcon = useSpring(widthTransformIcon, {
		mass: 0.05,
		stiffness: 250,
		damping: 15,
	});
	let heightIcon = useSpring(heightTransformIcon, {
		mass: 0.05,
		stiffness: 250,
		damping: 15,
	});

	const [hovered, setHovered] = useState(false);

	const handleClick = () => {
		if (onClick) {
			onClick();
		} else if (href && href !== "#") {
			window.location.href = href;
		}
	};

	const WrapperComponent = onClick || href === "#" ? "button" : "a";
	const wrapperProps =
		onClick || href === "#" ? { onClick: handleClick } : { href };

	return (
		<WrapperComponent {...wrapperProps}>
			<motion.div
				ref={ref}
				style={{ width, height }}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				className="relative flex aspect-square items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-150 will-change-transform">
				<AnimatePresence>
					{hovered && (
						<motion.div
							initial={{ opacity: 0, y: 10, x: "-50%" }}
							animate={{ opacity: 1, y: 0, x: "-50%" }}
							exit={{ opacity: 0, y: 2, x: "-50%" }}
							className="absolute -top-8 left-1/2 w-fit rounded-md border border-white/20 bg-black/60 px-2 py-0.5 text-xs whitespace-pre text-white">
							{title}
						</motion.div>
					)}
				</AnimatePresence>
				<motion.div
					style={{ width: widthIcon, height: heightIcon }}
					className="flex items-center justify-center text-white/90">
					{icon}
				</motion.div>
			</motion.div>
		</WrapperComponent>
	);
}
