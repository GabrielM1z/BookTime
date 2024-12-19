import { useAuth } from "@/hooks/useAuth";
import React, { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Settings() {
    const { logOut } = useAuth();

    const handleLogOut = () => {
        console.log("log out");
        // await logOut();
    }
    
    return (
        <SafeAreaView>
            <Text>Settings</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={handleLogOut}>
                <Text style={styles.settingsText}>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    settingsButton: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    settingsText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },
});
