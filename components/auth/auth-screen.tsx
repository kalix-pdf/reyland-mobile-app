import { useAppTheme } from '@/context/theme-context';
import { createAuthScreenStyles } from '@/styles/global.css';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, View, ScrollView } from 'react-native';
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
  const styles = createAuthScreenStyles(colors, isCompact, panelVariant);
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
