import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const Checkerboard = ({ size = 32, colors = ["#a8dadc", "#cdeac0"] }) => {
	const { width, height } = Dimensions.get("window");

	const rows = Math.ceil(height / size);
	const cols = Math.ceil(width / size);

	return (
		<View style={StyleSheet.absoluteFill}>
			{Array.from({ length: rows }).map((_, row) => (
				<View key={row} style={{ flexDirection: "row" }}>
					{Array.from({ length: cols }).map((_, col) => (
						<View
							key={col}
							style={{
								width: size,
								height: size,
								backgroundColor: colors[(row + col) % 2],
							}}
						/>
					))}
				</View>
			))}
		</View>
	);
};

export default Checkerboard;
