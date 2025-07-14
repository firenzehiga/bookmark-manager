import React from "react";

interface ShinyTextProps {
	text: string;
	disabled?: boolean;
	speed?: number;
	className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
	text,
	disabled = false,
	speed = 5,
	className = "",
}) => {
	if (disabled) {
		return <span className={`text-white ${className}`}>{text}</span>;
	}

	return (
		<span 
			className={`shiny-text ${className}`}
			style={{
				animationDuration: `${speed}s`,
			}}
		>
			{text}
		</span>
	);
};

export default ShinyText;
