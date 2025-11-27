// GameScreen.tsx
import Header from "@/components/Header";
import OpponentSection from "@/components/OpponentSection";
import PlayerSection from "@/components/PlayerSection";
import TrickDisplay from "@/components/TrickDisplay";
import TrickModal from "@/components/TrickModal";
import { opponents } from "@/data/opponents";
import { beginnerTricks, mediumTricks, proTricks } from "@/data/trickLists";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";

type Turn = "player" | "opponent" | null;
type TrickObj = { name: string; stances?: string | string[] };

export default function GameScreen() {
	// UI / modal
	const [showModal, setShowModal] = useState(false);

	// letters
	const [playerLetters, setPlayerLetters] = useState<string[]>([]);
	const [opponentLetters, setOpponentLetters] = useState<string[]>([]);

	// trick / turn / state
	const [currentTrick, setCurrentTrick] = useState<string>("");
	const [turn, setTurn] = useState<Turn>(null);
	const [isSettingTrick, setIsSettingTrick] = useState<boolean>(true);

	const [result, setResult] = useState<string>("");
	const [opponentLanded, setOpponentLanded] = useState<boolean>(false);

	// selection
	const [selectedStance, setSelectedStance] = useState<string | undefined>();
	const [selectedTrick, setSelectedTrick] = useState<string | null>(null);

	// last-chance flags
	const [playerLastChance, setPlayerLastChance] = useState(false);
	const [opponentLastChance, setOpponentLastChance] = useState(false);

	const SKATE = ["S", "K", "A", "T", "E"];

	const giveLetter = (currentLetters: string[]) => {
		const nextIndex = currentLetters.length;
		if (nextIndex >= SKATE.length) return currentLetters;
		return [...currentLetters, SKATE[nextIndex]];
	};

	// get params
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

	const level = (levelParam || "beginner").toLowerCase();

	const trickPool = useMemo<TrickObj[]>(() => {
		switch (level) {
			case "beginner":
				return beginnerTricks as unknown as TrickObj[];
			case "medium":
				return mediumTricks as unknown as TrickObj[];
			case "pro":
				return proTricks as unknown as TrickObj[];
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

	// refs to hold timeout ids so we can clear them in cleanup
	const setupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// initialize who starts
	useEffect(() => {
		setTurn(starter === "player" ? "player" : "opponent");
		setIsSettingTrick(true);
	}, [starter]);

	// Opponent AI: run when opponent is the setter
	useEffect(() => {
		// clear previous timers
		const clearAll = () => {
			if (setupTimeoutRef.current) clearTimeout(setupTimeoutRef.current);
			if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
			if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
			setupTimeoutRef.current = null;
			resultTimeoutRef.current = null;
			switchTimeoutRef.current = null;
		};

		if (turn !== "opponent") {
			// cleanup and return
			clearAll();
			return;
		}

		// show setup message and clear trick
		setResult(`${opponentName} is setting up for a...`);
		setCurrentTrick("");

		// Step 1: wait X ms then reveal trick + stance
		setupTimeoutRef.current = setTimeout(() => {
			const pool = trickPool.length ? trickPool : [{ name: "Ollie" }];
			const randomTrick = pool[
				Math.floor(Math.random() * pool.length)
			] as TrickObj;

			// handle stances which could be string | string[] | undefined
			const stancesArr = Array.isArray(randomTrick.stances)
				? randomTrick.stances
				: randomTrick.stances
				? String(randomTrick.stances)
						.split(",")
						.map((s) => s.trim())
				: ["regular"];

			const randomStance =
				stancesArr[Math.floor(Math.random() * stancesArr.length)] ?? "regular";
			const normalizedStance = (randomStance ?? "regular").toLowerCase().trim();
			const isDefaultStance =
				normalizedStance === "regular" ||
				normalizedStance === "normal" ||
				normalizedStance === "default";
			const stanceLabel = isDefaultStance ? "" : `${normalizedStance} `;

			setCurrentTrick(`${stanceLabel}${randomTrick.name}`);

			// Step 2: wait, then determine landed/bail
			resultTimeoutRef.current = setTimeout(() => {
				// difficulty tweak: easy = 0.8, medium = 0.6, hard = 0.4
				const prob =
					difficulty === "easy" ? 0.8 : difficulty === "hard" ? 0.4 : 0.6;
				const landed = Math.random() < prob;

				if (landed) {
					setOpponentLanded(true);
					setResult("Make!");
				} else {
					setOpponentLanded(false);
					setResult("Bailed!");
				}

				// Step 3: after a short pause, switch to player defending
				switchTimeoutRef.current = setTimeout(() => {
					setIsSettingTrick(false); // player now defends
					setTurn("player");
				}, 1000);
			}, 3000);
		}, 2000);

		// cleanup when turn changes or on unmount
		return () => {
			clearAll();
		};
	}, [turn, trickPool, opponentName, difficulty]);

	// player chooses stance (open modal)
	const handleStance = (stance: string) => {
		setSelectedStance(stance);
		setShowModal(true);
	};

	// handle player action (when player presses Land/Bail)
	const handlePlayerResponse = (choice: "Land" | "Bail") => {
		if (!turn) return;

		const isPlayerSetter = turn === "player";
		const isPlayerOffense = isPlayerSetter && isSettingTrick;

		// PLAYER is setting a trick (offense)
		if (isPlayerOffense) {
			if (choice === "Bail") {
				// missed own trick: no letter, opponent becomes setter
				setResult(`Dang! Back to ${opponentName}`);
				setTurn("opponent");
				setIsSettingTrick(true); // opponent will set next
			} else {
				// player landed while setting => opponent must defend
				setResult("Nice! Opponent must copy.");
				setIsSettingTrick(false); // player no longer setter
				setTurn("opponent"); // opponent will defend (or AI will be triggered)
			}
			// reset player's last-chance when moving on
			setPlayerLastChance(false);
			return;
		}

		// PLAYER is defending (copying opponent's trick)
		if (!isPlayerOffense) {
			if (choice === "Bail") {
				const current = playerLetters.length;

				// last-letter handling
				if (current === 4) {
					if (!playerLastChance) {
						setResult("LAST CHANCE! Bail again = SKATE!");
						setPlayerLastChance(true);
						return; // allow extra chance
					} else {
						setPlayerLetters((prev) => giveLetter(prev));
						setResult("Fatality! You Lost.");
						setPlayerLastChance(false);
						// TODO: trigger game over UI
						return;
					}
				}

				// normal bail on defense -> give letter
				setPlayerLetters((prev) => {
					const next = giveLetter(prev);
					setResult(`You got ${SKATE[prev.length]}`);
					return next;
				});
			} else {
				// landed while defending
				setResult("Nice! No letter.");
			}

			// after defending, switch so player becomes setter next (variant)
			setIsSettingTrick(true);
			setTurn("player");
			// reset last chance if they landed
			if (choice === "Land") setPlayerLastChance(false);
		}
	};

	// handle opponent response (used when simulating opponent defending after player sets)
	const handleOpponentResponse = (choice: string) => {
		if (!turn) return;

		const isOpponentSetter = turn === "opponent";
		const isOpponentOffense = isOpponentSetter && isSettingTrick;

		// opponent setting a trick
		if (isOpponentOffense) {
			if (choice === "Bail") {
				setResult("Opponent bailed. Your turn to set.");
				setTurn("player");
				setIsSettingTrick(true);
			} else {
				setResult("Opponent landed. Defend!");
				setTurn("player");
				setIsSettingTrick(false);
			}
			setOpponentLastChance(false);
			return;
		}

		// opponent defending (player had set)
		if (!isOpponentOffense) {
			if (choice === "Bail") {
				const current = opponentLetters.length;
				if (current === 4) {
					if (!opponentLastChance) {
						setResult("OPPONENT - LAST CHANCE!");
						setOpponentLastChance(true);
						return;
					} else {
						setOpponentLetters((prev) => {
							const next = giveLetter(prev);
							setResult("Opponent got the E — SKATE!");
							return next;
						});
						setOpponentLastChance(false);
						return;
					}
				}

				setOpponentLetters((prev) => {
					const next = giveLetter(prev);
					setResult(`Opponent got ${SKATE[prev.length]}`);
					return next;
				});
			} else {
				setResult("Opponent landed. No letter!");
			}

			setIsSettingTrick(true);
			setTurn("opponent");
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
		flex: 1,
		padding: 10,
		paddingTop: 20,
		justifyContent: "space-between",
	},
});
