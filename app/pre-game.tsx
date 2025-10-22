import Checkerboard from "@/components/Checkerboard";
import Header from "@/components/Header";
import { opponents } from "@/data/opponents";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const choices = [
	{ id: "rock", image: require("../assets/images/fist.png") },
	{ id: "paper", image: require("../assets/images/hand.png") },
	{ id: "scissors", image: require("../assets/images/victory.png") },
];

export default function PreGame() {
	const router = useRouter();
	const { difficulty, level, opponent } = useLocalSearchParams();

	const [playerChoice, setPlayerChoice] = useState<string | null>(null);
	const [opponentChoice, setOpponentChoice] = useState<string | null>(null);
	const [result, setResult] = useState<string | null>(null);

	// get select opponent
	const opponentData = opponents.find((o) => o.id === opponent);
	const opponentName = opponentData?.name || "Opponent";

	const handleChoice = (choiceId: string) => {
		const randomOpponent = choices[Math.floor(Math.random() * choices.length)];
		setPlayerChoice(choiceId);
		setOpponentChoice(randomOpponent.id);
		setResult(determineWinner(choiceId, randomOpponent.id));
	};

	const determineWinner = (player: string, opponentChoice: string) => {
		if (player === opponentChoice) return "It's a draw!";
		if (
			(player === "rock" && opponentChoice === "scissors") ||
			(player === "paper" && opponentChoice === "rock") ||
			(player === "scissors" && opponentChoice === "paper")
		) {
			return "You win! You set first trick";
		}
		// BELOW ------------ !!!!!!! make opponent the selected characters name
		return `You lose! ${opponentName} sets first trick`;
	};

	const goToGame = () => {
		router.push({
			pathname: "/game",
			params: {
				difficulty,
				level,
				opponent,
				starter: result?.includes("You win") ? "player" : "opponent",
			},
		});
	};

	return (
		<View style={styles.container}>
			<Checkerboard size={32} />
			<Header />
			<Text style={styles.title}>Rock Paper Scissors</Text>

			{!result && (
				<View style={styles.choices}>
					{choices.map((choice) => (
						<TouchableOpacity
							key={choice.id}
							style={styles.button}
							onPress={() => handleChoice(choice.id)}
						>
							<Image source={choice.image} style={styles.icon} />
						</TouchableOpacity>
					))}
				</View>
			)}

			{result && (
				<View style={styles.result}>
					<Text style={styles.infoText}>You chose: {playerChoice}</Text>
					<Text style={styles.infoText}>Opponent chose: {opponentChoice}</Text>
					<Text style={styles.resultText}>{result}</Text>

					{result.includes("draw") ? (
						<TouchableOpacity
							style={styles.continueButton}
							onPress={() => {
								setPlayerChoice(null);
								setOpponentChoice(null);
								setResult(null);
							}}
						>
							<Text style={styles.continueText}>Try Again</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.continueButton} onPress={goToGame}>
							<Text style={styles.continueText}>Continue</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8edeb", // soft pastel bg
		padding: 20,
	},
	title: {
		fontFamily: "PressStart2P",
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		textTransform: "uppercase",
	},
	choices: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
	},
	button: {
		backgroundColor: "#FF69B4",
		borderWidth: 3,
		borderColor: "#222",
		padding: 16,
		borderRadius: 8,
		marginHorizontal: 10,
	},
	buttonText: {
		fontWeight: "bold",
		color: "#fff",
	},
	result: {
		marginTop: 20,
		alignItems: "center",
	},
	infoText: {
		fontSize: 16,
		marginVertical: 8,
		fontFamily: "PressStart2P",
		textAlign: "center",
	},
	resultText: {
		fontSize: 22,
		marginVertical: 10,
		fontFamily: "PressStart2P",
		textAlign: "center",
	},
	continueButton: {
		backgroundColor: "#222",
		borderWidth: 3,
		borderColor: "#fff",
		paddingVertical: 14,
		paddingHorizontal: 32,
		marginVertical: 12,
		borderRadius: 5,
	},
	continueText: {
		fontFamily: "PressStart2P",
		fontSize: 12,
		color: "#fff",
		textTransform: "uppercase",
	},
	icon: {
		width: 60,
		height: 60,
		resizeMode: "contain",
	},
});
