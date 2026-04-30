import { InvestorDashboard } from "@/components/investor/investor-dashboard";
import { useAuth } from "@/context/auth-context";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

export function Investor() {
    const { user, login, logout } = useAuth();

    return !user ? (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Become an Investor!</Text>
            <Text style={styles.subtitle}>
                Join our platform and start investing today.
            </Text>
            <View style={styles.buttonWrapper}>
                <Button title="Sign Up as Investor" />
            </View>
        </SafeAreaView>
    ) : (
        <InvestorDashboard />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
        marginBottom: 32,
        textAlign: "center",
    },
    buttonWrapper: {
        width: "80%",
    },
});