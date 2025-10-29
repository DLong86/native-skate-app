import { useEffect, useState } from "react";

export const useTypewriter = (text: string, speed = 100) => {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		setDisplayedText("");
		let i = 0;
		const interval = setInterval(() => {
			setDisplayedText((prev) => prev + text[i]);
			i++;
			if (i >= text.length) clearInterval(interval);
		}, speed);

		return () => clearInterval(interval);
	}, [text, speed]);

	return displayedText + (displayedText.length < text.length ? "▮" : "");
};
