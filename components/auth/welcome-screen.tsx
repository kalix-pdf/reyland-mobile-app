import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createWelcomeScreenStyles } from '../../styles/auth.styles';

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
  const styles = createWelcomeScreenStyles(colors);

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
