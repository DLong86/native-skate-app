import Header from "@/components/Header";
import { opponents } from "@/data/opponents";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
	const [turn, setTurn] = useState<"player" | "opponent">("player");
	const [result, setResult] = useState("");

	const router = useRouter();

	const {
		difficulty = "medium",
		level = "1",
		opponent: opponentId,
	} = useLocalSearchParams() as {
		difficulty?: string;
		level?: string;
		opponent?: string;
		//   starter?: Starter;
	};
	// find opponent
	const opponentData = useMemo(
		() => opponents.find((o) => o.id === opponentId) ?? opponents[0],
		[opponentId]
	);
	const opponentName = opponentData.name ?? "Opponent";
	const opponentAvatar = opponentData.avatar ?? "";

	const handleStance = (stance: string) => {
		console.log("Stance: ", stance);
	};

	return (
		<ImageBackground
			source={require("../assets/images/earthbound-background2.jpg")}
			style={styles.background}
			resizeMode="cover"
		>
			<Header />

			{/* TOP: Opponent bar */}
			<View style={styles.opponentSection}>
				<View style={styles.opponent}>
					<Image source={opponentAvatar} />
					<Text style={styles.opponentName}>{opponentName}</Text>
				</View>
				<View style={styles.lettersRow}>
					{opponentLetters.map((letter, i) => (
						<View key={i} style={[styles.tile, i < 2 && styles.tileActive]}>
							<Text style={styles.tileText}>{letter}</Text>
						</View>
					))}
				</View>
			</View>

			{/* Trick Display */}
			<View style={styles.trickSection}>
				<Text style={styles.trickText}>{currentTrick}</Text>
				<Text style={styles.resultText}>Opponent Bailed!</Text>
			</View>

			{/* Player section */}
			<View style={styles.playerSection}>
				<View style={styles.lettersRow}>
					{playerLetters.map((letter, i) => (
						<View key={i} style={[styles.tile, i < 1 && styles.tileActive]}>
							<Text style={styles.tileText}>{letter}</Text>
						</View>
					))}
				</View>
				{isSettingTrick && (
					<View style={styles.buttonRow}>
						{["Normal", "Fakie", "Nollie", "Switch"].map((stance) => (
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
		backgroundColor: "rgba(255,255,255,0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 8,
	},

	tileText: {
		color: "#bbb",
		fontWeight: "bold",
		fontSize: 18,
		fontFamily: "PressStart2P",
	},
	tileActive: {
		backgroundColor: "rgba(0,0,0,0.6)",
		color: "#fff",
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
});
