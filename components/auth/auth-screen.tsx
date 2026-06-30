import React, { ReactElement, ReactNode, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControlProps,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthScreenProps = {
  heroTitle: string;
  children: ReactNode;
  layoutDensity?: 'default' | 'compact';
  scrollEnabled?: boolean;
  heroContent?: ReactNode;
  panelVariant?: 'sheet' | 'transparent';
  refreshControl?: ReactElement<RefreshControlProps>;
};

// Source image's intrinsic aspect ratio (width / height) and the
// fraction of the hero container's width it should span.
const HERO_BG_ASPECT_RATIO = 560 / 360;
const HERO_BG_WIDTH_RATIO = 1.55; // image is wider than the hero container, by design (it bleeds off the edges)
const HERO_BG_TOP_OFFSET_RATIO = - 100 / 560;
const HERO_BG_RIGHT_OFFSET_RATIO = -96 / 560;

export function AuthScreen({
  heroTitle,
  children,
  layoutDensity = 'default',
  scrollEnabled = false,
  heroContent,
  refreshControl,
}: AuthScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [heroWidth, setHeroWidth] = useState(windowWidth);

  const isCompact = layoutDensity === 'compact';
  // --- hero ---
  const heroPaddingBottomClass = isCompact ? 'pb-[26px]' : 'pb-[34px]'

  // --- hero title / subtitle ---
  const heroTitleFontClass = isCompact ? 'text-[30px]' : 'text-[30px]';
  const heroTitleLeadingClass = isCompact ? 'leading-[34px]' : 'leading-[30px]';

  const formPanelPaddingTopClass = isCompact ? 'pt-4' : 'pt-5';
  const formPanelPaddingBottomClass = isCompact ? 'pb-4' : 'pb-5.5';

  // Derive the decorative background image's size/position from the
  // actual measured width of the hero container, so it scales across
  // phone/tablet widths instead of using fixed pixel values.
  const heroBgWidth = heroWidth * HERO_BG_WIDTH_RATIO;
  const heroBgHeight = heroBgWidth / HERO_BG_ASPECT_RATIO;
  const heroBgTop = heroBgWidth * HERO_BG_TOP_OFFSET_RATIO;
  const heroBgRight = heroBgWidth * HERO_BG_RIGHT_OFFSET_RATIO;

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-background'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerClassName="grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        refreshControl={refreshControl}
      >
        <View className="flex-1">
          <View
            className={`bg-logoBackground px-6 overflow-hidden relative rounded-b-[30px] mx-4.5 ${heroPaddingBottomClass}`}
            style={{ paddingTop: insets.top + (isCompact ? 10 : 12) }}
            onLayout={(e) => setHeroWidth(e.nativeEvent.layout.width)}
          >
            <Image
              source={require('@/assets/images/auth-bg.jpg')}
              style={{
                position: 'absolute',
                top: heroBgTop,
                right: heroBgRight,
                width: heroBgWidth,
                height: heroBgHeight,
                opacity: 0.8,
              }}
              resizeMode="cover"
            />

            <View className="flex-1 justify-between z-[2]">
              <View className="flex-1 max-w-[250px] flex-row justify-between gap-4">
                <View className={`flex-1 max-w-[312px] justify-center gap-3`}>
                  {heroContent ? (
                    heroContent
                  ) : (
                    <>
                      <Text className={`text-white font-black tracking-[-1px] max-w-[196px] ${heroTitleFontClass} ${heroTitleLeadingClass}`}>
                        {heroTitle}
                      </Text>
                      <View className="min-h-[100px]" />
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View
            className={`flex-1 -mt-[61px] bg-surface rounded-t-[34px] px-6 ${formPanelPaddingTopClass} ${formPanelPaddingBottomClass}`}>
            {children}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
