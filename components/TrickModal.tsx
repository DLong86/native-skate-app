import React from "react";
import {
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const TrickModal = ({
	visible,
	onClose,
	onSelectTrick,
	stance,
}: {
	visible: boolean;
	onClose: () => void;
	onSelectTrick?: (trick: string) => void;
	stance?: string;
}) => {
	const tricks = [
		"Kickflip",
		"Heelflip",
		"Shuvit",
		"360 Flip",
		"Varial Kickflip",
	];

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Select a Trick</Text>
					<FlatList
						data={tricks}
						keyExtractor={(item) => item}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.trickButton}
								// onPress={() => onSelectTrick(item)}
							>
								<Text style={styles.trickText}>{item}</Text>
							</TouchableOpacity>
						)}
					/>
					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<Text style={styles.closeButtonText}>cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default TrickModal;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)", // dark overlay
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#111",
		borderRadius: 20,
		width: "80%",
		maxHeight: "70%",
		padding: 20,
		borderWidth: 2,
		borderColor: "#ff00ff", // psychedelic pink-purple border
		shadowColor: "#ff00ff",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.6,
		shadowRadius: 10,
	},
	modalTitle: {
		fontFamily: "PressStart2P",
		fontSize: 14,
		fontWeight: "bold",
		color: "#00ffe0",
		textAlign: "center",
		marginBottom: 15,
		textShadowColor: "#ff00ff",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
	trickButton: {
		backgroundColor: "#222",
		borderRadius: 12,
		paddingVertical: 12,
		marginVertical: 6,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#555",
	},
	trickText: {
		fontFamily: "PressStart2P",
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
		fontWeight: "600",
	},
	closeButton: {
		backgroundColor: "#00ffe0",
		borderRadius: 15,
		paddingVertical: 10,
		marginTop: 15,
	},
	closeButtonText: {
		fontFamily: "PressStart2P",
		color: "#222",
		fontSize: 14,
		textAlign: "center",
		fontWeight: "bold",
	},

	// stance buttons (for the main screen)
	stanceButtons: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 10,
		paddingHorizontal: 10,
	},
	stanceButton: {
		backgroundColor: "#222",
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderColor: "#ff00ff",
	},
	stanceButtonText: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
		fontWeight: "600",
	},
});
