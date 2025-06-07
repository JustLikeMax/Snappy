import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function EntdeckenScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor="#1E293B"
            headerImage={
                <Image
                    source={require("@/assets/images/partial-react-logo.png")}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Entdecken</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Welcome to Snappy!</ThemedText>
                <ThemedText>
                    Start discovering amazing people around you. Swipe to find
                    your perfect match!
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Ready to begin?</ThemedText>
                <ThemedText>
                    Your dating journey starts here. Explore profiles and make
                    meaningful connections.
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
