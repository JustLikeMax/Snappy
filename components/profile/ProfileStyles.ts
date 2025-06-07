import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        flex: 1,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    settingsButton: {
        padding: 8,
    },
    logoutButton: {
        padding: 8,
    },
    profileSection: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 24,
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    profileImageContainer: {
        marginBottom: 16,
    },
    profileImageWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    profileImagePlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
    },
    userName: {
        marginBottom: 4,
        textAlign: "center",
    },
    userEmail: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 8,
    },
    userBio: {
        fontSize: 16,
        textAlign: "center",
        lineHeight: 22,
    },
    section: {
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderWidth: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
    },
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    editButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    infoRowLast: {
        borderBottomWidth: 0,
    },
    infoText: {
        marginLeft: 12,
        fontSize: 16,
        flex: 1,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
    },
    cancelButton: {
        fontSize: 16,
    },
    saveButton: {
        fontSize: 16,
        fontWeight: "600",
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    // Settings styles
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingRowLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    settingRowRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingText: {
        marginLeft: 12,
        fontSize: 16,
    },
    settingValue: {
        fontSize: 16,
        marginRight: 8,
    },
    // Language option styles
    languageOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    selectedLanguageOption: {
        // Will be styled dynamically
    },
    languageOptionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 12,
    },
    languageName: {
        fontSize: 16,
    },
    // Theme option styles
    themeOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    selectedThemeOption: {
        // Will be styled dynamically
    },
    themeOptionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    themeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    themeOptionTitle: {
        fontSize: 16,
    },
    themeOptionDescription: {
        fontSize: 14,
    },
});
