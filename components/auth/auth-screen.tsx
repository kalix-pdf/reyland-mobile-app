import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

type AuthScreenProps = {
  heroTitle: string;
  children: ReactNode;
};

export function AuthScreen({ heroTitle, children }: AuthScreenProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <View style={styles.hero}>
            <Image
              source={require("@/assets/images/background.jpg")}
              style={styles.heroBackgroundImage}
              contentFit="cover"
            />

            <View style={styles.heroOverlay} />

            <View style={styles.heroDecorCircleOne} />
            <View style={styles.heroDecorCircleTwo} />

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{heroTitle}</Text>

              <LinearGradient
                colors={["rgba(0, 23, 28, 0.95)", "rgba(0, 140, 79, 0.55)", "rgba(0, 23, 28, 0.95)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoCard}
              >
                <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} contentFit="contain" />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.formPanel}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    screen: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    hero: {
      minHeight: 390,
      backgroundColor: Colors.logoBackground,
      paddingHorizontal: 24,
      paddingTop: 80,
      overflow: "hidden",
      position: "relative",
    },

    heroBackgroundImage: {
      position: "absolute",
      width: "150%",
      height: "150%",
      left: "50%",
      top: "50%",
      transform: [{ translateX: "-46%" }, { translateY: "-50%" }],
    },

    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 23, 28, 0.69)",
    },

    heroContent: {
      flex: 1,
      justifyContent: "space-between",
      zIndex: 2,
    },

    heroTitle: {
      maxWidth: 320,
      color: Colors.white,
      fontSize: 25,
      lineHeight: 33,
      fontWeight: "900",
      letterSpacing: -0.5,
    },

    heroDecorCircleOne: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 85,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      right: -50,
      top: 36,
      zIndex: 1,
    },

    heroDecorCircleTwo: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      left: -85,
      bottom: 18,
      zIndex: 1,
    },

    logoCard: {
      alignSelf: "center",
      width: 170,
      height: 135,
      borderRadius: 30,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 50,
      shadowColor: Colors.black,
      shadowOpacity: 0.28,
      shadowRadius: 18,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 8,
    },

    logoImage: {
      width: 290,
      height: 230,
    },

    formPanel: {
      flex: 1,
      marginTop: -30,
      backgroundColor: Colors.surface,
      borderTopLeftRadius: 34,
      borderTopRightRadius: 34,
      paddingHorizontal: 24,
      paddingTop: 26,
      paddingBottom: 30,
      shadowColor: Colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: -8,
      },
      elevation: 8,
    },
  });
