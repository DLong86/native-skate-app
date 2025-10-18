import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function StartScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			{/* <Checkerboard size={32} /> */}
			<StatusBar style="light" />
			<Image
				source={require("../assets/images/skate-logo2.png")}
				style={styles.logo}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push("/difficulty")}
			>
				<Text style={styles.buttonText}>Start Game</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				// onPress={() => router.push("/stats")}
			>
				<Text style={styles.buttonText}>User Stats</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#222",
	},

	logo: {
		// fontFamily: "RetroPixel",
		// fontSize: 36,
		// fontWeight: "bold",
		// textShadowColor: "#222", // outline color
		// textShadowOffset: { width: 2, height: 2 },
		// textShadowRadius: 1,
		// color: "#FF69B4",
		// width: 300,
		// height: 150,
		// borderWidth: 4,
		// borderColor: "#fff",
		// borderRadius: 5,
		marginBottom: 20,
	},
	titleBox: {
		// backgroundColor: "#ffc278ff",
		// borderWidth: 4,
		// borderColor: "#222",
		padding: 16,
		marginBottom: 20,
		// borderRadius: 5,
	},
	titleText: {
		fontFamily: "RetroPixel",
		fontSize: 36,
		fontWeight: "bold",
		textShadowColor: "#222", // outline color
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 1,
		color: "#FF69B4",
		// marginBottom: 28,
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
		textTransform: "uppercase",
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
