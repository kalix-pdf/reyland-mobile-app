import { AppColors } from '@/constants/colors';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type WelcomeScreenProps = {
  onSignIn: () => void;
  onSignUp: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  isFacebookLoading: boolean;
  isGoogleLoading: boolean;
};

export function WelcomeScreen({
  onSignIn,
  onSignUp,
  onGoogleLogin,
  onFacebookLogin,
  isGoogleLoading,
  isFacebookLoading,
}: WelcomeScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <LinearGradient
        colors={[colors.accent, colors.accentDark, colors.primary]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.screen, { paddingTop: insets.top }]}
      >
        <View style={styles.glowTopRight} />
        <View style={styles.glowBottomLeft} />

        <View style={[styles.content, { paddingBottom: 36 + insets.bottom }]}>
          <View style={styles.brandBlock}>
            <Image source={require('@/assets/images/logo_transparent.png')} style={styles.logo} contentFit="contain" />
            {/* <Text style={styles.title}>Welcome Back</Text> */}
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.signInButton} onPress={onSignIn} disabled={isGoogleLoading || isFacebookLoading}>
              <Text style={styles.signInText}>SIGN IN</Text>
            </Pressable>

            <Pressable style={styles.signUpButton} onPress={onSignUp} disabled={isGoogleLoading || isFacebookLoading}>
              <Text style={styles.signUpText}>SIGN UP</Text>
            </Pressable>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialLabel}>Login with Social Media</Text>

            <View style={styles.socialRow}>
              <Pressable
                style={styles.socialButton}
                onPress={onGoogleLogin}
                disabled={isGoogleLoading || isFacebookLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Image
                    source={require('@/assets/images/google-logo.png')}
                    style={styles.googleIcon}
                    contentFit="contain"
                  />
                )}
              </Pressable>

              <Pressable
                style={styles.socialButton}
                onPress={onFacebookLogin}
                disabled={isGoogleLoading || isFacebookLoading}
              >
                {isFacebookLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="logo-facebook" size={30} color={colors.white} />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.logoBackground,
    },

    screen: {
      flex: 1,
      // overflow: 'hidden',
      paddingHorizontal: 32,
      // paddingBottom: 18,
    },

    glowTopRight: {
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: 'rgba(255,255,255,0.08)',
      top: -40,
      right: -95,
    },

    glowBottomLeft: {
      position: 'absolute',
      width: 210,
      height: 210,
      borderRadius: 105,
      backgroundColor: 'rgba(255,255,255,0.08)',
      bottom: 130,
      left: -95,
    },

    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 96,
    },

    brandBlock: {
      alignItems: 'center',
    },

    logo: {
      width: 360,
      height: 360,
    },

    brandText: {
      color: Colors.white,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '900',
      letterSpacing: 1.8,
      textAlign: 'center',
    },

    title: {
      color: Colors.white,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 30,
    },

    actions: {
      width: '100%',
      gap: 16,
      marginTop: 54,
      marginBottom: 60,
    },

    signInButton: {
      minHeight: 56,
      borderRadius: 999,
      borderWidth: 1.4,
      borderColor: 'rgba(255,255,255,0.42)',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },

    signInText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 0.3,
    },

    signUpButton: {
      minHeight: 56,
      borderRadius: 999,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 2,
    },

    signUpText: {
      color: Colors.textPrimary,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 0.3,
    },

    socialSection: {
      alignItems: 'center',
    },

    socialLabel: {
      color: 'rgba(255,255,255,0.74)',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 18,
    },

    socialRow: {
      flexDirection: 'row',
      gap: 20,
    },

    socialButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    googleIcon: {
      width: 27,
      height: 27,
    },
  });
