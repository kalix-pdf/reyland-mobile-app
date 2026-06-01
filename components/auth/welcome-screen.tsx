import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
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

  const player = useVideoPlayer(require('@/assets/vid/welcome-page-bg.mp4'), (p: any) => {
    p.loop = true;
    p.muted = true;
    p.audioMixingMode = 'mixWithOthers';
    p.play();
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={{ flex: 1 }}>
        {/* Background Video */}
        <VideoView
          player={player}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          nativeControls={false}
        />

        {/* Overlay */}
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.45)' }]} />

        {/* Glow effects */}
        <View style={styles.glowTopRight} />
        <View style={styles.glowBottomLeft} />

        <View style={[styles.content, { paddingTop: insets.top, paddingBottom: 36 + insets.bottom }]}>
          <View style={styles.brandBlock}>
            <Image
              source={require('@/assets/images/logo_transparent.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.signInButton}
              onPress={onSignIn}
              disabled={isGoogleLoading || isFacebookLoading}
            >
              <Text style={styles.signInText}>SIGN IN</Text>
            </Pressable>

            <Pressable
              style={styles.signUpButton}
              onPress={onSignUp}
              disabled={isGoogleLoading || isFacebookLoading}
            >
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
      </View>
    </SafeAreaView>
  );
}