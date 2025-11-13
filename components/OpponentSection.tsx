import React from "react";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	View,
} from "react-native";

type OpponentSectionProps = {
	opponentName: string;
	avatar: ImageSourcePropType;
	letters: string[];
	active: boolean;
};

export default function OpponentSection({
	opponentName,
	avatar,
	letters,
	active,
}: OpponentSectionProps) {
	return (
		<View style={[styles.opponentSection, !active && styles.inactiveSection]}>
			<View style={styles.opponent}>
				<Image source={avatar} />
				<Text style={styles.opponentName}>{opponentName}</Text>
			</View>

			<View style={styles.lettersRow}>
				{letters.map((letter, i) => {
					const isActive = i < 2; // you can adjust this logic later dynamically
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
		</View>
	);
}
const styles = StyleSheet.create({
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
	inactiveSection: {
		opacity: 0.6,
		transform: [{ scale: 0.98 }],
	},
});
