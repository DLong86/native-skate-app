import React from "react";
import {
	StyleSheet,
	Text,
	// Image,
	TouchableOpacity,
	View,
} from "react-native";

type PlayerSectionProps = {
	opponentLanded: boolean;
	// avatar: ImageSourcePropType;
	onPlayerResponse: (choice: string) => void;
	letters: string[];
	active: boolean;
	isSettingTrick: boolean;
	onStanceSelect: (stance: string) => void;
};

export default function PlayerSection({
	opponentLanded,
	isSettingTrick,
	letters,
	onStanceSelect,
	onPlayerResponse,
	active,
}: PlayerSectionProps) {
	return (
		<View style={[styles.playerSection, !active && styles.inactiveSection]}>
			<Text style={styles.name}>Player</Text>
			<View style={styles.lettersRow}>
				{letters.map((letter, i) => {
					const isActive = i < 1; // change based on progress later
					return (
						<View key={i} style={[styles.tile, isActive && styles.tileActive]}>
							<Text
								style={[styles.tileText, isActive && styles.tileTextActive]}
							>
								{letter}
							</Text>
						</View>
					);
				})}
			</View>

			{active && (
				<View style={styles.buttonRow}>
					{opponentLanded
						? ["Make", "Bail"].map((result) => (
								<TouchableOpacity
									key={result}
									style={styles.button}
									onPress={() => onPlayerResponse(result)}
								>
									<Text style={styles.buttonText}>{result}</Text>
								</TouchableOpacity>
						  ))
						: isSettingTrick &&
						  ["Normal", "Fakie", "Nollie", "Switch"].map((stance) => (
								<TouchableOpacity
									key={stance}
									style={styles.button}
									onPress={() => onStanceSelect(stance)}
								>
									<Text style={styles.buttonText}>{stance}</Text>
								</TouchableOpacity>
						  ))}
				</View>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	playerSection: {
		// marginTop: 50,
		backgroundColor: "#222",
		borderWidth: 3,
		borderColor: "#fff",
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 40,
	},
	name: {
		color: "#fff",
		fontWeight: "bold",
		fontFamily: "PressStart2P",
		fontSize: 14,
		paddingVertical: 8,
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
	inactiveSection: {
		opacity: 0.6,
		transform: [{ scale: 0.98 }],
	},
});
