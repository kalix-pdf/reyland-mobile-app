export const sharedPressedScale = {
  opacity: 0.9,
  transform: [{ scale: 0.98 }],
} as const;

export const sharedHeaderActionPressed = {
  opacity: 0.85,
  transform: [{ scale: 0.97 }],
} as const;

export const sharedBrandPillBase = {
  alignSelf: 'flex-start' as const,
  minHeight: 30,
  borderRadius: 999,
  borderWidth: 1,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 8,
  paddingHorizontal: 12,
} as const;

export const sharedBrandDotBase = {
  width: 8,
  height: 8,
  borderRadius: 4,
} as const;

export const sharedBrandPillTextBase = {
  fontSize: 11,
  lineHeight: 14,
  fontWeight: '900' as const,
  letterSpacing: 1.4,
} as const;

export const sharedHeroDecorCircleOne = {
  position: 'absolute' as const,
  width: 170,
  height: 170,
  borderRadius: 85,
  borderWidth: 1,
  right: -58,
  top: 18,
} as const;

export const sharedHeroDecorCircleTwo = {
  position: 'absolute' as const,
  width: 220,
  height: 220,
  borderRadius: 110,
  borderWidth: 1,
  left: -92,
} as const;

export const sharedAuthDividerRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 12,
  marginTop: 22,
} as const;

export const sharedAuthDivider = {
  flex: 1,
  height: 1,
} as const;

export const sharedAuthDividerText = {
  fontSize: 13,
  fontWeight: '700' as const,
} as const;

export const sharedAuthSocialButtonsRow = {
  flexDirection: 'row' as const,
  gap: 12,
} as const;

export const sharedAuthSocialButtonBase = {
  flex: 1,
  minHeight: 52,
  borderRadius: 26,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 8,
  borderWidth: 1,
} as const;

export const sharedAuthSocialButtonPressed = {
  opacity: 0.82,
  transform: [{ scale: 0.985 }],
} as const;

export const sharedAuthSocialButtonText = {
  fontSize: 14,
  fontWeight: '800' as const,
} as const;

export const sharedGoogleIcon = {
  width: 20,
  height: 20,
} as const;

export const sharedAvatarImageFill = {
  width: '100%' as const,
  height: '100%' as const,
} as const;

export const sharedLoginPillBase = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 6,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 999,
  borderWidth: 1.5,
} as const;

export const sharedLoginPillText = {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '900' as const,
} as const;

export const sharedSmallAvatarBase = {
  width: 46,
  height: 46,
  borderRadius: 23,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderWidth: 1.5,
} as const;
