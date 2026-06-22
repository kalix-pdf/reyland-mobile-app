import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

type WelcomeScreenProps = {
  onSignIn: () => void;
  onSignUp: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  isFacebookLoading: boolean;
  isGoogleLoading: boolean;
};

export function WelcomeScreen({ onSignIn, onSignUp, onGoogleLogin, onFacebookLogin, isGoogleLoading, isFacebookLoading }: WelcomeScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const disabled = isGoogleLoading || isFacebookLoading;

  const player = useVideoPlayer(require('@/assets/vid/welcome-page-bg.mp4'), (p: any) => {
    p.loop = true;
    p.muted = true;
    p.audioMixingMode = 'mixWithOthers';
    p.play();
  });

  return (
    <SafeAreaView
      className="flex-1 bg-logoBackground" edges={['left', 'right']}>
      <View className="flex-1">
        {/* Background Video */}
        <VideoView
          player={player}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          nativeControls={false}
        />

        {/* Overlay */}
        <View className="bg-[rgba(0,0,0,0.45)]" style={StyleSheet.absoluteFillObject} />

        {/* Glow effects */}
        <View className="absolute w-[300px] h-[300px] rounded-[150px] bg-[rgba(255,255,255,0.08)] top-[-40px] right-[-95px]" />
        <View className="absolute w-[210px] h-[210px] rounded-[105px] bg-[rgba(255,255,255,0.08)] bottom-[130px] left-[-95px]" />

        <View className="flex-1 items-center justify-between"
          style={{ paddingTop: insets.top, paddingBottom: 36 + insets.bottom }}>
          <View className="items-center">
            <Image
              source={require('@/assets/images/logo_transparent.png')}
              style={{width: 360, height: 360}}
              contentFit="contain"
            />
          </View>

          <View className="w-full gap-4 mt-[45px] mb-[60px] p-5">
            <Pressable
              className="min-h-[56px] rounded-full border-[1.4px] border-[rgba(255,255,255,0.42)] items-center justify-center bg-transparent active:opacity-50 disabled:opacity-60"
              onPress={onSignIn}
              disabled={disabled}>
              <Text className="text-base font-black tracking-[0.3px] text-white">
                SIGN IN </Text>
            </Pressable>

              <Pressable
                className="min-h-[56px] rounded-full items-center justify-center active:opacity-50 disabled:opacity-60"
                style={{ backgroundColor: colors.white }}
                onPress={onSignUp}
                disabled={disabled}>
                <Text className="text-base font-black tracking-[0.3px]"
                  style={{ color: colors.textPrimary }}>
                  SIGN UP </Text>
              </Pressable>
          </View>

          <View className="items-center">
            <Text className="text-[14px] leading-5 font-semibold text-center mb-[18px] text-[rgba(255,255,255,0.74)]">
              Login with Social Media </Text>

            <View className="flex-row gap-5">
              <Pressable className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.18)] items-center justify-center active:opacity-50 disabled:opacity-60"
                onPress={onGoogleLogin}
                disabled={disabled}>
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Image
                    source={require('@/assets/images/google-logo.png')}
                    style={{width: 27, height: 27}}
                    contentFit="contain"
                  />
                )}
              </Pressable>

              <Pressable className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.18)] items-center justify-center active:opacity-50 disabled:opacity-60"
                onPress={onFacebookLogin}
                disabled={disabled}>
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