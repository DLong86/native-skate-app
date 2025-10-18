import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header() {
	const router = useRouter();

	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={() => router.back()}>
				<Image
					source={require("../assets/images/arrow-left.png")}
					style={styles.icon}
				/>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => router.push("/")}>
				<Image
					source={require("../assets/images/home.png")}
					style={styles.icon}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		top: 30,
		left: 20,
		right: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		zIndex: 10,
	},
	icon: {
		width: 30,
		height: 30,
		resizeMode: "contain",
	},
});
