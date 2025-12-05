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
		// helper to clear timers
		const clearAll = () => {
			if (setupTimeoutRef.current) clearTimeout(setupTimeoutRef.current);
			if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
			if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
			setupTimeoutRef.current = null;
			resultTimeoutRef.current = null;
			switchTimeoutRef.current = null;
		};

		// Run AI **only** when opponent is the active setter
		if (turn !== "opponent" || !isSettingTrick) {
			clearAll();
			return;
		}

		// show setup message and clear trick
		setResult(`${opponentName} is setting up for a...`);
		setCurrentTrick("");

		// Step 1: reveal trick after delay
		setupTimeoutRef.current = setTimeout(() => {
			const pool = trickPool.length ? trickPool : [{ name: "Ollie" }];
			const randomTrick = pool[
				Math.floor(Math.random() * pool.length)
			] as TrickObj;

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

			// Step 2: after a short wait decide landed or bailed
			resultTimeoutRef.current = setTimeout(() => {
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

				// Step 3: switch to player — **behaviour depends on landed**
				// - If opponent LANDED: player must defend (player is defender)
				// - If opponent BAILED while setting: player should be allowed to SET next
				switchTimeoutRef.current = setTimeout(() => {
					// update BOTH states in the same tick
					setTurn("player");
					setIsSettingTrick(!landed); // if opponent landed → false, else → true
					if (!landed) setCurrentTrick(""); // clear trick immediately so buttons appear
				}, 500); // reduce delay so buttons feel responsive
			}, 3000);
		}, 2000);

		// cleanup when turn changes or on unmount
		return () => {
			clearAll();
		};
	}, [turn, trickPool, opponentName, difficulty, isSettingTrick]);

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
				// opponent will set next
				setTurn("opponent");
				setIsSettingTrick(true);
			} else {
				// player landed while setting => opponent must defend
				setResult("Nice! Opponent must copy.");
				setTurn("opponent"); // opponent will defend (or AI will be triggered)
				setIsSettingTrick(false); // player no longer setter
			}
			// reset player's last-chance when moving on
			setPlayerLastChance(false);
			return;
		}

		// PLAYER is defending (copying opponent's trick)
		if (!isPlayerOffense) {
			// player is defending
			if (choice === "Bail") {
				const current = playerLetters.length;

				if (current === 4) {
					if (!playerLastChance) {
						setResult("LAST CHANCE! Bail again = SKATE!");
						setPlayerLastChance(true);
						return;
					} else {
						setPlayerLetters((prev) => giveLetter(prev));
						setResult("Fatality! You Lost.");
						setPlayerLastChance(false);
						return;
					}
				}

				setPlayerLetters((prev) => {
					const next = giveLetter(prev);
					setResult(`You got ${SKATE[prev.length]}`);
					return next;
				});
			} else {
				setResult("Nice! No letter.");
				setPlayerLastChance(false);
			}

			// ✅ Immediately give opponent their turn
			setCurrentTrick("");
			setTurn("opponent");
			setIsSettingTrick(true); // opponent sets next trick
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
				setTurn("player");
				setResult("Opponent bailed. Your turn to set.");
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
						setOpponentLetters((prev) => giveLetter(prev));
						setResult("Opponent got the E — SKATE!");
						setOpponentLastChance(false);
						return;
					}
				}

				setOpponentLetters((prev) => giveLetter(prev));
				setResult(`Opponent got ${SKATE[current]}`);
				setOpponentLastChance(false);
			} else {
				setResult("Opponent landed. No letter!");
				setOpponentLastChance(false);
			}

			setTurn("opponent");
			setIsSettingTrick(true);
			return;
		}
	};

	const handleSelectTrick = (trickName: string) => {
		setShowModal(false);

		const stanceLabel =
			selectedStance && selectedStance !== "normal" ? `${selectedStance} ` : "";

		const trickString = `${stanceLabel}${trickName}`;

		setCurrentTrick(trickString);
		setSelectedTrick(trickName);

		// After player sets, they need to say if they landed it or not
		setIsSettingTrick(true);
		setTurn("player");

		setResult("Player is setting up for...");
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
				currentTrick={currentTrick}
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
