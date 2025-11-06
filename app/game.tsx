import Header from "@/components/Header";
import TrickModal from "@/components/TrickModal";
import { opponents } from "@/data/opponents";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

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

	return (
		<ImageBackground
			source={require("../assets/images/earthbound-background2.jpg")}
			style={styles.background}
			// resizeMode="contain"
		>
			<Header />

			{/* TOP: Opponent bar */}
			<View
				style={[
					styles.opponentSection,
					turn !== "opponent" && styles.inactiveSection,
				]}
			>
				<View style={styles.opponent}>
					<Image source={opponentAvatar} />
					<Text style={styles.opponentName}>{opponentName}</Text>
				</View>
				<View style={styles.lettersRow}>
					{opponentLetters.map((letter, i) => {
						const isActive = i < 2;
						return (
							<View
								key={i}
								style={[styles.tile, isActive && styles.tileActive]}
							>
								<Text
									style={[styles.tileText, isActive && styles.tileTextActive]}
								>
									{letter}
								</Text>
							</View>
						);
					})}
				</View>
			</View>

			{/* Trick Display */}
			<View style={styles.trickSection}>
				<Text style={styles.resultText}>{result}</Text>
				{currentTrick ? (
					<Text style={styles.trickText}>{currentTrick}</Text>
				) : null}
			</View>

			{/* Player section */}
			<View
				style={[
					styles.playerSection,
					turn !== "player" && styles.inactiveSection,
				]}
			>
				<View style={styles.lettersRow}>
					{playerLetters.map((letter, i) => {
						const isActive = i < 1; // change based on progress later
						return (
							<View
								key={i}
								style={[styles.tile, isActive && styles.tileActive]}
							>
								<Text
									style={[styles.tileText, isActive && styles.tileTextActive]}
								>
									{letter}
								</Text>
							</View>
						);
					})}
				</View>
				{/* {isSettingTrick && (
					<View style={styles.buttonRow}>
						{["Normal", "Fakie", "Nollie", "Switch"].map((stance) => (
							<TouchableOpacity
								key={stance}
								style={styles.button}
								onPress={() => handleStance(stance)}
								disabled={turn !== "player"}
							>
								<Text style={styles.buttonText}>{stance}</Text>
							</TouchableOpacity>
						))}
					</View>
				)} */}
				{turn === "player" && (
					<View style={styles.buttonRow}>
						{opponentLanded
							? ["Make", "Bail"].map((result) => (
									<TouchableOpacity
										key={result}
										style={styles.button}
										onPress={() => handlePlayerResponse(result)}
									>
										<Text style={styles.buttonText}>{result}</Text>
									</TouchableOpacity>
							  ))
							: isSettingTrick &&
							  ["Normal", "Fakie", "Nollie", "Switch"].map((stance) => (
									<TouchableOpacity
										key={stance}
										style={styles.button}
										onPress={() => handleStance(stance)}
									>
										<Text style={styles.buttonText}>{stance}</Text>
									</TouchableOpacity>
							  ))}
					</View>
				)}
			</View>
			<TrickModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				stance={selectedStance}
				onSelectTrick={(trickName: string) => {
					setCurrentTrick(`${selectedStance} ${trickName}`);
					setIsSettingTrick(false);
					setShowModal(false);
				}}
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
	opponentSection: {
		// alignItems: "center",
		marginTop: 50,
		backgroundColor: "#222",
		borderWidth: 3,
		borderColor: "#fff",
		borderRadius: 5,
		paddingHorizontal: 2,
	},
	opponent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 2,
		marginTop: 2,
		marginBottom: 8,
		gap: 4,
	},
	opponentName: {
		fontFamily: "PressStart2P",
		fontSize: 14,
		color: "#fff",
	},
	lettersRow: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		alignContent: "center",
		margin: "auto",
	},
	tile: {
		width: 50,
		height: 50,
		borderWidth: 2,
		borderColor: "#fff",
		borderRadius: 5,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 8,
		color: "#fff",
	},

	tileText: {
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "PressStart2P",
		color: "#fff",
		opacity: 0.1,
	},
	tileTextActive: {
		opacity: 1,
	},
	tileActive: {
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	trickSection: {
		alignItems: "center",
		alignContent: "center",
	},
	trickText: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 8,
		fontFamily: "PressStart2P",
		textAlign: "center",
	},

	resultText: {
		fontSize: 18,
		color: "#fffa",
		fontFamily: "PressStart2P",
		marginBottom: 12,
		alignItems: "center",
		paddingHorizontal: 8,
		textAlign: "center",
	},
	playerSection: {
		// marginTop: 50,
		backgroundColor: "#222",
		borderWidth: 3,
		borderColor: "#fff",
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 40,
	},
	buttonRow: {
		flexDirection: "row",
		// marginTop: 20,
		justifyContent: "space-between",
		gap: 4,
		paddingVertical: 12,
	},
	button: {
		backgroundColor: "#222",
		paddingVertical: 10,
		paddingHorizontal: 6,
		borderWidth: 3,
		borderColor: "#fff",
		borderRadius: 5,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontFamily: "PressStart2P",
		fontSize: 10,
	},

	inactiveSection: {
		opacity: 0.6,
		transform: [{ scale: 0.98 }],
	},
});
