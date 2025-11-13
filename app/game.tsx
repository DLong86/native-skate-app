import Header from "@/components/Header";
import OpponentSection from "@/components/OpponentSection";
import PlayerSection from "@/components/PlayerSection";
import TrickDisplay from "@/components/TrickDisplay";
import TrickModal from "@/components/TrickModal";
import { opponents } from "@/data/opponents";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function GameScreen() {
	const [showModal, setShowModal] = useState(false);
	const [opponentLetters, setOpponentLetters] = useState([
		"S",
		"K",
		"A",
		"T",
		"E",
	]);
	const [playerLetters, setPlayerLetters] = useState(["S", "K", "A", "T", "E"]);
	const [currentTrick, setCurrentTrick] = useState("Kickflip");
	const [isSettingTrick, setIsSettingTrick] = useState(true);
	const [turn, setTurn] = useState<string | null>(null);
	const [result, setResult] = useState("");
	const [isOpponentSetting, setIsOpponentSetting] = useState(false);
	const [opponentLanded, setOpponentLanded] = useState(false);
	const [selectedStance, setSelectedStance] = useState<string | undefined>();
	const [selectedTrick, setSelectedTrick] = useState<string | null>(null);

	const router = useRouter();

	const {
		difficulty = "medium",
		level = "1",
		opponent: opponentId,
		starter,
	} = useLocalSearchParams() as {
		difficulty?: string;
		level?: string;
		opponent?: string;
		starter?: string;
	};
	// find opponent
	const opponentData = useMemo(
		() => opponents.find((o) => o.id === opponentId) ?? opponents[0],
		[opponentId]
	);
	const opponentName = opponentData.name ?? "Opponent";
	const opponentAvatar = opponentData.avatar ?? "";

	useEffect(() => {
		setTurn(starter === "player" ? "player" : "opponent");
	}, [starter]);

	useEffect(() => {
		if (turn === "opponent") {
			setResult(`${opponentName} is setting up for a...`);
			setCurrentTrick("");

			//  Show ste up message 1st
			const setupTimeout = setTimeout(() => {
				// choose random trick ----- !!! LATER from the trick list !!!! -----
				const tricks = ["Kickflip", "Fs 180", "Heelflip", "Nollie Bs 180"];
				const randomTrick = tricks[Math.floor(Math.random() * tricks.length)];
				setCurrentTrick(randomTrick);

				//  wait 2 seconds again then landed or bailed...
				const resultTimeout = setTimeout(() => {
					const landed = Math.random() < 0.6;
					if (landed) {
						setOpponentLanded(true);
						setResult("Make!");
						setCurrentTrick("");

						// Switch to players turn
						setTimeout(() => {
							setTurn("player");
						}, 1000);
					} else {
						setOpponentLanded(false);
						setResult("Bailed!");
						setCurrentTrick("");

						// hand turn back to player
						setTimeout(() => {
							setTurn("player");
							setIsSettingTrick(true);
							setResult("");
							setCurrentTrick("");
						}, 3000);
					}
				}, 3000);

				return () => clearTimeout(resultTimeout);
			}, 2000);
			return () => clearTimeout(setupTimeout);
		}
	}, [turn]);

	const handleStance = (stance: string) => {
		setSelectedStance(stance);
		setShowModal(true);
	};

	const handlePlayerResponse = (choice: string) => {
		console.log(`Player chose ${choice}`);
		// Player gets letter
		if (choice === "Bail") {
			console.log("Player gets letter!!!");
		} else {
			console.log("Player landed");
		}

		setResult("");
		setTurn("opponent");
		setIsSettingTrick(false);
		setOpponentLanded(false);
	};

	const handleSelectTrick = (trickName: string) => {
		setSelectedTrick(trickName);
		setShowModal(false);

		console.log(`Selected ${selectedStance} - ${trickName}`);
	};

	return (
		<ImageBackground
			source={require("../assets/images/earthbound-background2.jpg")}
			style={styles.background}
			// resizeMode="contain"
		>
			<Header />
			<OpponentSection
				opponentName={opponentName}
				avatar={opponentAvatar}
				letters={opponentLetters}
				active={turn === "opponent"}
			/>

			<TrickDisplay currentTrick={currentTrick} result={result} />

			<PlayerSection
				letters={playerLetters}
				active={turn === "player"}
				opponentLanded={opponentLanded}
				isSettingTrick={isSettingTrick}
				onStanceSelect={handleStance}
				onPlayerResponse={handlePlayerResponse}
			/>

			<TrickModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				stance={selectedStance}
				onSelectTrick={handleSelectTrick}
			/>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1, // fill the entire screen
		padding: 10,
		paddingTop: 20,
		justifyContent: "space-between",
	},
});
