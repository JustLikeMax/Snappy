import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DialogButton = {
    text: string;
    onPress: () => void;
    style?:
        | "cancel"
        | "default"
        | "destructive"
        | "outline"
        | "ghost"
        | "flat"
        | "secondary";
};

type Props = {
    visible: boolean;
    title: string;
    message: string;
    buttons: DialogButton[];
    onRequestClose?: () => void;
};

export default function AlertDialog({
    visible,
    title,
    message,
    buttons,
    onRequestClose,
}: Props) {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.backdrop}>
                <View
                    style={[styles.dialog, { backgroundColor: Colors.surface }]}
                >
                    <Text style={[styles.title, { color: Colors.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.message, { color: Colors.text }]}>
                        {message}
                    </Text>
                    <View style={styles.buttonRow}>
                        {buttons.map((btn, index) => {
                            const buttonStyle = getButtonStyle(btn.style);
                            const textStyle = getTextStyle(btn.style);

                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={btn.onPress}
                                    style={[styles.button, buttonStyle]}
                                >
                                    <Text
                                        style={[styles.buttonText, textStyle]}
                                    >
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// Style helpers
function getButtonStyle(style?: DialogButton["style"]) {
    switch (style) {
        case "cancel":
            return { backgroundColor: Colors.accent };
        case "destructive":
            return { backgroundColor: "#FF3B30" };
        case "outline":
            return {
                borderWidth: 1,
                borderColor: Colors.tint,
                backgroundColor: "transparent",
            };
        case "ghost":
            return {
                backgroundColor: "transparent",
                shadowOpacity: 0,
            };
        case "flat":
            return {
                backgroundColor: Colors.background,
            };
        case "secondary":
            return {
                backgroundColor: Colors.icon,
            };
        default:
            return { backgroundColor: Colors.tint };
    }
}

function getTextStyle(style?: DialogButton["style"]) {
    switch (style) {
        case "destructive":
            return { color: "white" };
        case "outline":
            return { color: Colors.tint };
        case "ghost":
            return { color: Colors.text };
        case "flat":
            return { color: Colors.text };
        case "cancel":
            return { color: Colors.text };
        case "secondary":
            return { color: "white" };
        default:
            return { color: "white" };
    }
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        width: "85%",
        padding: 20,
        borderRadius: 16,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        gap: 12,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 80,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
