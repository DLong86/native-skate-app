import Checkerboard from "@/components/Checkerboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { beginnerTricks, mediumTricks, proTricks } from "../data/trickLists";

export default function StartScreen() {
	const router = useRouter();

	const [step, setStep] = useState<"difficulty" | "level">("difficulty");
	const [difficulty, setDifficulty] = useState<string | null>(null);

	const handleSelectDifficulty = (diff: string) => {
		setDifficulty(diff);
		setStep("level");
	};

	const handleSelectLevel = (level: string) => {
		router.push({
			pathname: "/game",
			params: { difficulty, level },
		});
	};

	const levelOptions = [
		{ name: "Beginner", tricks: beginnerTricks },
		{ name: "Medium", tricks: mediumTricks },
		{ name: "Pro", tricks: proTricks },
	];

	return (
		<View style={styles.container}>
			{/* Checkerboard background */}
			<Checkerboard size={32} />

			{/* Title box */}
			<View style={styles.titleBox}>
				<Text style={styles.titleText}>GAME of SKATE</Text>
			</View>

			{step === "difficulty" && (
				<>
					<Text style={styles.subtitle}>Choose Difficulty</Text>

					<TouchableOpacity
						style={styles.button}
						onPress={() => handleSelectDifficulty("easy")}
					>
						<Text style={styles.buttonText}>Easy</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.button}
						onPress={() => handleSelectDifficulty("medium")}
					>
						<Text style={styles.buttonText}>Medium</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.button}
						onPress={() => handleSelectDifficulty("hard")}
					>
						<Text style={styles.buttonText}>Hard</Text>
					</TouchableOpacity>
				</>
			)}

			{step === "level" && (
				<>
					<Text style={styles.subtitle}>Choose Trick Level</Text>
					{levelOptions.map((level) => (
						<TouchableOpacity
							key={level.name}
							style={styles.button}
							onPress={() => handleSelectLevel(level.name.toLowerCase())}
						>
							<Text style={styles.buttonText}>{level.name}</Text>
						</TouchableOpacity>
					))}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	titleBox: {
		backgroundColor: "#222",
		borderWidth: 4,
		borderColor: "#fff",
		padding: 16,
		marginBottom: 20,
		borderRadius: 5,
	},
	titleText: {
		fontFamily: "Tiny5",
		fontSize: 32,
		fontWeight: "bold",
		textShadowColor: "#000", // outline color
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 1,
		color: "#fff",
	},
	subtitle: {
		fontFamily: "PressStart2P",
		fontSize: 12,
		color: "#fff",
		marginBottom: 20,
		backgroundColor: "#222",
		borderWidth: 2,
		borderColor: "#fff",
		padding: 12,
		borderRadius: 5,
	},
	button: {
		backgroundColor: "#222",
		borderWidth: 3,
		borderColor: "#fff",
		paddingVertical: 14,
		paddingHorizontal: 32,
		marginVertical: 8,
		borderRadius: 5,
	},
	buttonText: {
		fontFamily: "PressStart2P",
		fontSize: 12,
		color: "#fff",
		textTransform: "uppercase",
	},
});
