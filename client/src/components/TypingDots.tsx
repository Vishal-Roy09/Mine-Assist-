import React from "react";

export default function TypingDots() {
	return (
		<span className="inline-flex items-center gap-1">
			<span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
			<span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.1s]" />
			<span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
		</span>
	);
}


