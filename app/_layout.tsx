import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	const [fontsLoaded] = useFonts({
		PressStart2P: require("../assets/fonts/PressStart2P.ttf"),
		Tiny5: require("../assets/fonts/Tiny5.ttf"),
	});

	if (!fontsLoaded) return <View />;

	return (
		<Stack
			screenOptions={{
				headerShown: false, // 🚀 hide the header everywhere
			}}
		/>
	);
}
