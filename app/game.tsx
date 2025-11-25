import Header from "@/components/Header";
import OpponentSection from "@/components/OpponentSection";
import PlayerSection from "@/components/PlayerSection";
import TrickDisplay from "@/components/TrickDisplay";
import TrickModal from "@/components/TrickModal";
import { opponents } from "@/data/opponents";
import { beginnerTricks, mediumTricks, proTricks } from "@/data/trickLists";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function GameScreen() {
	const [showModal, setShowModal] = useState(false);
	const [playerLetters, setPlayerLetters] = useState<string[]>([]);
	const [opponentLetters, setOpponentLetters] = useState<string[]>([]);
	const [currentTrick, setCurrentTrick] = useState("Kickflip");
	const [isSettingTrick, setIsSettingTrick] = useState(true);
	const [turn, setTurn] = useState<string | null>(null);
	const [result, setResult] = useState("");
	const [isOpponentSetting, setIsOpponentSetting] = useState(false);
	const [opponentLanded, setOpponentLanded] = useState(false);
	const [selectedStance, setSelectedStance] = useState<string | undefined>();
	const [selectedTrick, setSelectedTrick] = useState<string | null>(null);

	const SKATE = ["S", "K", "A", "T", "E"];

	const giveLetter = (currentLetters: string[]) => {
		const nextIndex = currentLetters.length;

		return [...currentLetters, SKATE[nextIndex]];
	};

	const {
		difficulty = "medium",
		level: levelParam = "beginner",
		opponent: opponentId,
		starter,
	} = useLocalSearchParams() as {
		difficulty?: string;
		level?: string;
		opponent?: string;
		starter?: string;
	};

	const level = levelParam.toLowerCase();

	const trickPool = useMemo(() => {
		switch (level) {
			case "beginner":
				return beginnerTricks;
			case "medium":
				return mediumTricks;
			case "pro":
				return proTricks;
			default:
				return [];
		}
	}, [level]);

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
			// show the setup message
			setResult(`${opponentName} is setting up for a...`);
			setCurrentTrick(""); // clear any previous trick

			// wait 2 seconds before showing trick
			const setupTimeout = setTimeout(() => {
				// SELECT TRICK + STANCE
				const randomTrick =
					trickPool[Math.floor(Math.random() * trickPool.length)];

				const stances = Array.isArray(randomTrick?.stances)
					? randomTrick.stances
					: ["regular"];

				const randomStance =
					stances[Math.floor(Math.random() * stances.length)];

				const normalizedStance = randomStance.toLowerCase().trim();

				// identify “normal” stance values
				const isDefaultStance =
					normalizedStance === "regular" ||
					normalizedStance === "normal" ||
					normalizedStance === "default";

				// don't show stance for normal/regular/default
				const stanceLabel = isDefaultStance ? "" : `${normalizedStance} `;

				setCurrentTrick(`${stanceLabel}${randomTrick.name}`);

				// wait another 3 seconds to show Make/Bail
				const resultTimeout = setTimeout(() => {
					const landed = Math.random() < 0.6;

					if (landed) {
						setOpponentLanded(true);
						setResult("Make!");

						setTimeout(() => {
							setTurn("player");
						}, 1000);
					} else {
						setOpponentLanded(false);
						setResult("Bailed!");

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

		const isOffense = isSettingTrick;
		// Player gets letter
		if (isOffense) {
			if (choice === "Bail") {
				// bail on offense = no letter, lose turn
				setTurn("opponent");
				setIsSettingTrick(false);
				setResult(`Dang!, Back to ${opponentName}`);
				return;
			} else {
				// landed on offense
				setTurn("opponent");
				setIsSettingTrick(false);
				setResult("Nice");
				return;
			}
		} else {
			// Player on defense
			if (choice === "Bail") {
				const current = playerLetters.length;

				if (current === 4) {
					// They are upo to S-K-A-T
					if (!opponentLanded) {
						setResult("Last chance!");
						return;
					} else {
						// second bail on "E"
						setPlayerLetters(giveLetter(playerLetters));
						setResult("Fatality! You Lost");
						return;
					}
				}

				// Regular bail on defense = give next letter
				setPlayerLetters(giveLetter(playerLetters));
				setResult(`You got ${SKATE[current]}`);
			} else {
				setResult("Nice! No letter");
			}

			// swith offense back
			setTurn("opponent");
			setIsSettingTrick(false);
		}
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
