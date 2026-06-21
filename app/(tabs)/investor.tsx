import { InvestorDashboard } from '@/components/investor/investor-dashboard';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { createInvestorTabStyles } from '../../styles/dashboard.styles';

export default function Investor() {
  // const styles = createInvestorTabStyles(Colors);
  // const { user } = useAuth();
  // const insets = useSafeAreaInsets();

  // if (user?.role === 1) {
  //   return <InvestorDashboard />;
  // }

  // return (
  //   <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
  //     <View style={[styles.hero, { paddingTop: insets.top + 18 }]}>
  //       <View style={styles.heroDecorCircleOne} />
  //       <View style={styles.heroDecorCircleTwo} />

  //       <View style={styles.heroHeader}>
  //         <View style={styles.brandPill}>
  //           <View style={styles.brandDot} />
  //           <Text style={styles.brandPillText}>Investor access</Text>
  //         </View>
  //       </View>
  //       <Text style={styles.heroTitle}>Become an Investor</Text>
  //       <Text style={styles.heroSubtitle}>
  //         Join our platform and unlock portfolio tools, performance tracking, and curated opportunities.
  //       </Text>
  //     </View>

  //     <View style={styles.contentPanel}>
  //       <View style={styles.card}>
  //         <View style={styles.cardAccent} />

  //         <View style={styles.cardHeader}>
  //           <View style={styles.cardBadge}>
  //             <Ionicons name="trending-up-outline" size={14} color={Colors.accent} />
  //             <Text style={styles.cardBadgeText}>Investor upgrade</Text>
  //           </View>

  //           {/* <View style={styles.cardIconWrap}>
  //             <Ionicons name="briefcase-outline" size={22} color={Colors.white} />
  //           </View> */}
  //         </View>

  //         <Text style={styles.cardTitle}>Build with Reyland</Text>
  //         <Text style={styles.cardText}>
  //           Get access to investor dashboards, property insights, and a clearer view of your holdings in one place.
  //         </Text>

  //         {/* <View style={styles.benefitsList}>
  //           <View style={styles.benefitItem}>
  //             <View style={styles.benefitDot} />
  //             <Text style={styles.benefitText}>Track properties, growth, and activity in one dashboard</Text>
  //           </View>
  //           <View style={styles.benefitItem}>
  //             <View style={styles.benefitDot} />
  //             <Text style={styles.benefitText}>Review curated opportunities built for long-term value</Text>
  //           </View>
  //           <View style={styles.benefitItem}>
  //             <View style={styles.benefitDot} />
  //             <Text style={styles.benefitText}>Move from interest to investor onboarding with less friction</Text>
  //           </View>
  //         </View> */}

  //         <Pressable
  //           style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
  //           onPress={() => {
  //             router.push('/investor-signup');
  //           }}
  //         >
  //           <Text style={styles.buttonText}>Sign Up as Investor</Text>
  //           <Ionicons name="arrow-forward" size={18} color={Colors.white} />
  //         </Pressable>
  //       </View>
  //     </View>
  //   </SafeAreaView>
  // );
}
