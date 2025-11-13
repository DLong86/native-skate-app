import React from "react";
import { StyleSheet, Text, View } from "react-native";

type TrickDisplayProps = {
	result: string;
	currentTrick: string;
};

export default function TrickDisplay({
	result,
	currentTrick,
}: TrickDisplayProps) {
	return (
		<View style={styles.trickSection}>
			<Text style={styles.resultText}>{result}</Text>
			{currentTrick ? (
				<Text style={styles.trickText}>{currentTrick}</Text>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
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
});
