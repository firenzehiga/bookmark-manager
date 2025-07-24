import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Bookmark Manager - Kelola Bookmark Dengan Mudah";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: "system-ui",
				}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: 40,
					}}>
					<div
						style={{
							width: 80,
							height: 80,
							background: "#3b82f6",
							borderRadius: 16,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginRight: 24,
						}}>
						<svg width="40" height="40" viewBox="0 0 24 24" fill="white">
							<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
						</svg>
					</div>
					<div
						style={{
							fontSize: 72,
							fontWeight: "bold",
							color: "white",
						}}>
						Bookmark Manager
					</div>
				</div>
				<div
					style={{
						fontSize: 32,
						color: "#94a3b8",
						textAlign: "center",
						maxWidth: 800,
					}}>
					Kelola Bookmark Dengan Mudah - Platform terbaik untuk menyimpan dan
					mengorganisir link favorit Anda
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
