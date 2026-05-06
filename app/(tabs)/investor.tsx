import { InvestorDashboard } from '@/components/investor/investor-dashboard'
import { Colors } from '@/constants/colors'
import { useAuth } from '@/context/auth-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Investor() {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()

  if (user?.role === 1) {
    return <InvestorDashboard />
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <View style={[styles.hero, { paddingTop: insets.top + 18 }]}>
        <View style={styles.heroDecorCircleOne} />
        <View style={styles.heroDecorCircleTwo} />

        <View style={styles.heroHeader}>
          <View style={styles.brandPill}>
            <View style={styles.brandDot} />
            <Text style={styles.brandPillText}>Investor access</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Become an Investor</Text>
        <Text style={styles.heroSubtitle}>
          Join our platform and unlock portfolio tools, performance tracking, and curated opportunities.
        </Text>
      </View>

      <View style={styles.contentPanel}>
        <View style={styles.card}>
          <View style={styles.cardAccent} />

          <View style={styles.cardHeader}>
            <View style={styles.cardBadge}>
              <Ionicons name="trending-up-outline" size={14} color={Colors.accent} />
              <Text style={styles.cardBadgeText}>Investor upgrade</Text>
            </View>

            {/* <View style={styles.cardIconWrap}>
              <Ionicons name="briefcase-outline" size={22} color={Colors.white} />
            </View> */}
          </View>

          <Text style={styles.cardTitle}>Build with Reyland</Text>
          <Text style={styles.cardText}>
            Get access to investor dashboards, property insights, and a clearer view of your holdings in one place.
          </Text>

          {/* <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Track properties, growth, and activity in one dashboard</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Review curated opportunities built for long-term value</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Move from interest to investor onboarding with less friction</Text>
            </View>
          </View> */}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => {
              router.push('/investor-signup')
            }}
          >
            <Text style={styles.buttonText}>Sign Up as Investor</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    minHeight: 230,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroDecorCircleOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    right: -58,
    top: 18,
  },
  heroDecorCircleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    left: -92,
    bottom: -92,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.76)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.8)',
    maxWidth: 340,
  },
  contentPanel: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingTop: 18,
    marginTop: -29,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.tag,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardBadgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.6,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 18,
  },
  benefitsList: {
    gap: 12,
    marginBottom: 22,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: Colors.accent,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '900',
  },

  brandPill: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
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
    textTransform: 'uppercase',
  },

  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  heroSubtitle: {
    marginTop: 10,
    maxWidth: 290,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
})
