import Checkerboard from "@/components/Checkerboard";
import Header from "@/components/Header";
import { opponents } from "@/data/opponents";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const router = useRouter()

export default function OpponentScreen() {
	const router = useRouter();
	const { difficulty, level } = useLocalSearchParams<{
		difficulty?: string;
		level?: string;
	}>();

	const handleSelect = (opponentId: string) => {
		router.push({
			pathname: "/pre-game",
			params: { difficulty, level, opponent: opponentId },
		});
	};

	return (
		<View style={styles.container}>
			<Checkerboard size={32} />
			<Header />
			<Text style={styles.title}>Choose Opponent</Text>
			<View style={styles.grid}>
				{opponents.map((op) => (
					<TouchableOpacity
						key={op.id}
						style={styles.card}
						onPress={() => handleSelect(op.id)}
					>
						<Image source={op.avatar} style={styles.avatar} />
						<Text style={styles.name}>{op.name}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#cce3de",
		padding: 16,
	},
	title: {
		fontFamily: "PressStart2P",
		fontSize: 20,
		color: "#000",
		marginBottom: 20,
		fontWeight: "bold",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	card: {
		alignItems: "center",
		margin: 8,
		borderWidth: 3,
		borderColor: "#fff",
		borderRadius: 5,
		backgroundColor: "#222",
		padding: 12,
		color: "#fff",
	},
	avatar: {
		width: 70,
		height: 70,
		marginBottom: 8,
	},
	name: {
		fontFamily: "PressStart2P",
		fontSize: 10,
		color: "#fff",
		textAlign: "center",
	},
});
