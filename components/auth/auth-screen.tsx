import { AppColors } from '@/constants/colors'
import { useAppTheme } from '@/context/theme-context'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React, { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type AuthScreenProps = {
  heroTitle: string
  children: ReactNode
  layoutDensity?: 'default' | 'compact'
  scrollEnabled?: boolean
}

export function AuthScreen({ heroTitle, children, layoutDensity = 'default', scrollEnabled = true }: AuthScreenProps) {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()
  const isCompact = layoutDensity === 'compact'
  const styles = createStyles(colors, isCompact)

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        alwaysBounceVertical={false}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <View style={styles.screen}>
          <View style={[styles.hero, { paddingTop: insets.top + (isCompact ? 12 : 18) }]}>
            <Image
              source={require('@/assets/images/background.jpg')}
              style={styles.heroBackgroundImage}
              contentFit="cover"
            />

            <LinearGradient
              colors={['rgba(7, 16, 20, 0.93)', 'rgba(7, 16, 20, 0.69)', 'rgba(7, 16, 20, 0.90)']}
              locations={[0, 0.5, 1]}
              style={styles.heroOverlay}
            />

            <LinearGradient
              colors={['rgba(79, 196, 122, 0.18)', 'rgba(0, 140, 79, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroAccent}
            />

            <View style={styles.heroContent}>
              <View style={styles.heroCopy}>
                <View style={styles.heroRule} />

                <View style={styles.brandPill}>
                  <View style={styles.brandDot} />
                  <Text style={styles.brandPillText}>REYLAND</Text>
                </View>

                <Text style={styles.heroTitle}>{heroTitle}</Text>
                <Text style={styles.heroSubtitle}>Find verified homes, lots, and investment-ready properties.</Text>
              </View>
            </View>
          </View>

          <View style={styles.formPanel}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const createStyles = (Colors: AppColors, isCompact: boolean) =>
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
      minHeight: isCompact ? 300 : 416,
      backgroundColor: Colors.logoBackground,
      paddingHorizontal: 24,
      paddingBottom: isCompact ? 40 : 74,
      overflow: 'hidden',
      position: 'relative',
    },

    heroBackgroundImage: {
      position: 'absolute',
      width: '141%',
      height: '141%',
      left: '-12%',
      top: 0,
    },

    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
    },

    heroAccent: {
      position: 'absolute',
      width: 220,
      height: 220,
      right: -88,
      top: 24,
      borderRadius: 110,
      transform: [{ rotate: '16deg' }],
    },

    heroContent: {
      flex: 1,
      justifyContent: 'space-between',
      zIndex: 2,
    },

    heroCopy: {
      minHeight: isCompact ? 126 : 160,
      justifyContent: 'flex-start',
      gap: isCompact ? 10 : 14,
      maxWidth: 312,
    },

    heroRule: {
      width: 44,
      height: 3,
      borderRadius: 999,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      marginBottom: 4,
    },

    brandPill: {
      alignSelf: 'flex-start',
      minHeight: 30,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.14)',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
    },

    brandDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.logoGreenLight,
    },

    brandPillText: {
      color: Colors.white,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '900',
      letterSpacing: 1.4,
    },

    heroTitle: {
      color: Colors.white,
      fontSize: isCompact ? 27 : 31,
      lineHeight: isCompact ? 33 : 38,
      fontWeight: '900',
      letterSpacing: -0.7,
    },

    heroSubtitle: {
      maxWidth: 276,
      color: 'rgba(255, 255, 255, 0.72)',
      fontSize: isCompact ? 12 : 13,
      lineHeight: isCompact ? 18 : 20,
      fontWeight: '600',
    },

    heroDecorCircleOne: {
      position: 'absolute',
      width: 170,
      height: 170,
      borderRadius: 85,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      right: -50,
      top: 36,
      zIndex: 1,
    },

    heroDecorCircleTwo: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.12)',
      left: -85,
      bottom: 18,
      zIndex: 1,
    },

    formPanel: {
      flex: 1,
      marginTop: -26,
      backgroundColor: Colors.surface,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: 24,
      paddingTop: isCompact ? 18 : 28,
      paddingBottom: isCompact ? 22 : 34,
      shadowColor: Colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 24,
      shadowOffset: {
        width: 0,
        height: -10,
      },
      elevation: 8,
    },
  })
