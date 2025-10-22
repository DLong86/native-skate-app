import Header from "@/components/Header";
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

	const handleStance = (stance: string) => {
		console.log("Stance: ", stance);
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
				<Text style={styles.trickText}>{currentTrick}</Text>
				<Text style={styles.resultText}>Opponent Bailed!</Text>
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
				{isSettingTrick && (
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
				)}
			</View>
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
	},
	trickText: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 8,
		fontFamily: "PressStart2P",
	},

	resultText: {
		fontSize: 18,
		color: "#fffa",
		fontFamily: "PressStart2P",
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
