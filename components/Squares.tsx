import React, { useRef, useEffect, useState } from "react";

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
	x: number;
	y: number;
}

interface SquaresProps {
	direction?: "diagonal" | "up" | "right" | "down" | "left";
	speed?: number;
	borderColor?: CanvasStrokeStyle;
	squareSize?: number;
	hoverFillColor?: CanvasStrokeStyle;
	debug?: boolean;
}

const SquaresEnhanced: React.FC<SquaresProps> = ({
	direction = "right",
	speed = 1,
	borderColor = "#4f46e5",
	squareSize = 40,
	hoverFillColor = "rgba(79, 70, 229, 0.2)",
	debug = false,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const requestRef = useRef<number | null>(null);
	const numSquaresX = useRef<number>(0);
	const numSquaresY = useRef<number>(0);
	const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
	const hoveredSquareRef = useRef<GridOffset | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		if (debug) {
			console.log("🎨 Squares Enhanced: Canvas initialized");
		}

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
			numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;

			if (debug) {
				console.log(
					`📐 Canvas resized: ${canvas.width}x${canvas.height}, Squares: ${numSquaresX.current}x${numSquaresY.current}`
				);
			}
		};

		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		const drawGrid = () => {
			if (!ctx) return;

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
			const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

			// Draw squares
			for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
				for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
					const squareX = x - (gridOffset.current.x % squareSize);
					const squareY = y - (gridOffset.current.y % squareSize);

					// Hover effect
					if (
						hoveredSquareRef.current &&
						Math.floor((x - startX) / squareSize) ===
							hoveredSquareRef.current.x &&
						Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
					) {
						ctx.fillStyle = hoverFillColor;
						ctx.fillRect(squareX, squareY, squareSize, squareSize);
					}

					// Draw border
					ctx.strokeStyle = borderColor;
					ctx.lineWidth = 1;
					ctx.strokeRect(squareX, squareY, squareSize, squareSize);
				}
			}

			// Debug info
			if (debug) {
				ctx.fillStyle = "#00ff00";
				ctx.font = "12px monospace";
				ctx.fillText(`FPS: ${Math.round(1000 / 16)}`, 10, 20);
				ctx.fillText(
					`Offset: ${Math.round(gridOffset.current.x)}, ${Math.round(
						gridOffset.current.y
					)}`,
					10,
					40
				);
				ctx.fillText(`Direction: ${direction}`, 10, 60);
				ctx.fillText(`Speed: ${speed}`, 10, 80);
			}
		};

		const updateAnimation = () => {
			setIsAnimating(true);
			const effectiveSpeed = Math.max(speed, 0.1);

			switch (direction) {
				case "right":
					gridOffset.current.x =
						(gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
					break;
				case "left":
					gridOffset.current.x =
						(gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
					break;
				case "up":
					gridOffset.current.y =
						(gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
					break;
				case "down":
					gridOffset.current.y =
						(gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
					break;
				case "diagonal":
					gridOffset.current.x =
						(gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
					gridOffset.current.y =
						(gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
					break;
				default:
					break;
			}

			drawGrid();
			requestRef.current = requestAnimationFrame(updateAnimation);
		};

		const handleMouseMove = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
			const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

			const hoveredSquareX = Math.floor(
				(mouseX + gridOffset.current.x - startX) / squareSize
			);
			const hoveredSquareY = Math.floor(
				(mouseY + gridOffset.current.y - startY) / squareSize
			);

			if (
				!hoveredSquareRef.current ||
				hoveredSquareRef.current.x !== hoveredSquareX ||
				hoveredSquareRef.current.y !== hoveredSquareY
			) {
				hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
			}
		};

		const handleMouseLeave = () => {
			hoveredSquareRef.current = null;
		};

		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseleave", handleMouseLeave);
		requestRef.current = requestAnimationFrame(updateAnimation);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (requestRef.current) cancelAnimationFrame(requestRef.current);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseleave", handleMouseLeave);
			setIsAnimating(false);

			if (debug) {
				console.log("🧹 Squares Enhanced: Cleaned up");
			}
		};
	}, [direction, speed, borderColor, hoverFillColor, squareSize, debug]);

	return (
		<div className="w-full h-full relative">
			<canvas
				ref={canvasRef}
				className="w-full h-full border-none block"
				style={{ background: debug ? "rgba(255,0,0,0.1)" : "transparent" }}
			/>

			{debug && (
				<div className="absolute top-4 left-4 bg-black/80 text-green-400 p-2 rounded text-xs font-mono">
					<div>Squares Enhanced Debug</div>
					<div>Status: {isAnimating ? "🟢 Active" : "🔴 Inactive"}</div>
					<div>Direction: {direction}</div>
					<div>Speed: {speed}</div>
					<div>Size: {squareSize}px</div>
				</div>
			)}
		</div>
	);
};

export default SquaresEnhanced;
