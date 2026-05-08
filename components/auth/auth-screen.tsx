import { AppColors } from '@/constants/colors';
import { useAppTheme } from '@/context/theme-context';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthScreenProps = {
  heroTitle: string;
  children: ReactNode;
  layoutDensity?: 'default' | 'compact';
  scrollEnabled?: boolean;
  heroContent?: ReactNode;
  panelVariant?: 'sheet' | 'transparent';
};

export function AuthScreen({
  heroTitle,
  children,
  layoutDensity = 'default',
  scrollEnabled = false,
  heroContent,
  panelVariant = 'sheet',
}: AuthScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isCompact = layoutDensity === 'compact';
  const styles = createStyles(colors, isCompact, panelVariant);
  const useCompactSheetLayout = panelVariant === 'sheet' && isCompact;

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        // alwaysBounceVertical={false}
        // bounces={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <View style={styles.screen}>
          <View style={[styles.hero, { paddingTop: insets.top + (useCompactSheetLayout ? 10 : 12) }]}>
            <LinearGradient
              colors={[colors.accent, colors.accentDark, colors.primary]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.heroBackground}
            />

            <LinearGradient
              colors={['rgba(0, 23, 28, 0.14)', 'rgba(0, 23, 28, 0)', 'rgba(0, 23, 28, 0.28)']}
              locations={[0, 0.4, 1]}
              style={styles.heroOverlay}
            />

            <Image
              source={require('@/assets/images/logo_transparent_without_text_bg.png')}
              style={styles.heroBrandMarkPrimary}
              resizeMode="contain"
            />

            <Image
              source={require('@/assets/images/logo_transparent_without_text_bg.png')}
              style={styles.heroBrandMarkSecondary}
              resizeMode="contain"
            />

            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroCopy}>
                  {heroContent ? (
                    heroContent
                  ) : (
                    <>
                      <View style={styles.heroRule} />

                      {/* <View style={styles.brandPill}>
                        <View style={styles.brandDot} />
                        <Text style={styles.brandPillText}>REYLAND</Text>
                      </View> */}

                      <Text style={styles.heroTitle}>{heroTitle}</Text>
                      <Text style={styles.heroSubtitle}>
                        Find verified homes, lots, and investment-ready properties.
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.formPanel}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (Colors: AppColors, isCompact: boolean, panelVariant: 'sheet' | 'transparent') =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: panelVariant === 'transparent' ? Colors.logoBackground : Colors.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    screen: {
      flex: 1,
      // backgroundColor: panelVariant === 'transparent' ? Colors.logoBackground : Colors.background,
    },

    hero: {
      // minHeight: panelVariant === 'transparent' ? (isCompact ? 640 : 720) : isCompact ? 232 : 350,
      backgroundColor: Colors.logoBackground,
      paddingHorizontal: 24,
      paddingBottom: panelVariant === 'transparent' ? (isCompact ? 26 : 34) : isCompact ? 22 : 28,
      overflow: 'hidden',
      position: 'relative',
      borderBottomLeftRadius: panelVariant === 'transparent' ? 30 : 0,
      borderBottomRightRadius: panelVariant === 'transparent' ? 30 : 0,
      marginHorizontal: panelVariant === 'transparent' ? 18 : 0,
      marginTop: 0,
    },

    heroBackground: {
      ...StyleSheet.absoluteFillObject,
    },

    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
    },

    heroBrandMarkPrimary: {
      position: 'absolute',
      width: 360,
      height: 360,
      top: -42,
      right: -128,
      opacity: 0.12,
      transform: [{ rotate: '2deg' }],
    },

    heroBrandMarkSecondary: {
      position: 'absolute',
      width: 248,
      // height: 248,
      bottom: -92,
      left: -108,
      opacity: 0.08,
      transform: [{ rotate: '-10deg' }],
    },

    heroContent: {
      flex: 1,
      justifyContent: 'space-between',
      zIndex: 2,
    },

    heroTopRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },

    heroCopy: {
      flex: 1,
      justifyContent: panelVariant === 'transparent' ? 'center' : 'flex-start',
      gap: isCompact ? 8 : 12,
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
      fontSize: isCompact ? 30 : 34,
      lineHeight: isCompact ? 34 : 38,
      fontWeight: '900',
      letterSpacing: -1,
      maxWidth: 196,
    },

    heroSubtitle: {
      maxWidth: 250,
      color: 'rgba(255, 255, 255, 0.72)',
      fontSize: isCompact ? 12 : 13,
      lineHeight: isCompact ? 18 : 20,
      fontWeight: '600',
      minHeight: 100
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
      flex: panelVariant === 'transparent' ? 0 : 1,
      marginTop: panelVariant === 'transparent' ? -6 : -81,
      backgroundColor: panelVariant === 'transparent' ? 'transparent' : Colors.surface,
      borderTopLeftRadius: panelVariant === 'transparent' ? 0 : 34,
      borderTopRightRadius: panelVariant === 'transparent' ? 0 : 34,
      paddingHorizontal: panelVariant === 'transparent' ? 28 : 24,
      paddingTop: panelVariant === 'transparent' ? 0 : isCompact ? 16 : 20,
      paddingBottom: panelVariant === 'transparent' ? 0 : isCompact ? 16 : 22,
      shadowColor: Colors.black,
      shadowOpacity: panelVariant === 'transparent' ? 0 : 0.1,
      shadowRadius: 24,
      shadowOffset: {
        width: 0,
        height: -10,
      },
      elevation: panelVariant === 'transparent' ? 0 : 8,
    },
  });
