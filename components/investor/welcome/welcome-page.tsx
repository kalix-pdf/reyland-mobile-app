import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HeaderTitle } from '@/components/header/HeaderTitle';
import { HeaderShell } from '@/components/header/HeaderShell';
import { Image } from 'expo-image';

interface WelcomePageProps {
    onGetStarted: () => void;
}

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }[] = [
    {
        icon: 'trending-up',
        title: 'Grow Your Affiliate Earnings',
        description: 'Access exclusive affiliate opportunities and grow your income with our expert guidance.'
    }, 
    {
        icon: 'shield-checkmark',
        title: 'Secure & Transparent',
        description: 'Track every peso with clear payout schedules and real-time affiliate status.',
    },
    {
         icon: 'stats-chart',
        title: 'Track Your Portfolio',
        description: 'Monitor your active affiliate earnings and upcoming payouts, all in one dashboard.',
    }
]

export function WelcomeInvestorPage({ onGetStarted }: WelcomePageProps) {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <HeaderShell transparent>
                <HeaderTitle title='Affiliate' />
            </HeaderShell>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} className="px-5">
                <View className="rounded-b-[40px] overflow-hidden">
                    <Image
                        source={require('@/assets/images/auth-bg.jpg')}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                    />

                    <View className="absolute inset-0 bg-black/40" />

                    <View className="items-center px-6 pt-10 pb-14">
                        <View className="w-20 h-20 rounded-full bg-logoBackground items-center justify-center mb-6 shadow-lg">
                        <Ionicons name="business" size={36} color="#ffffff" />
                        </View>

                        <Text className="text-heroText text-3xl font-bold text-center leading-tight">
                        Secure Your{'\n'}Future Today
                        </Text>
                        <Text className="text-heroText text-lg font-semibold text-center mt-2 px-2">
                        Become a Reyland Affiliate and unlock exclusive affiliate opportunities.
                        </Text>
                        <Text className="text-heroText/80 text-base text-center mt-3 px-4">
                        Join Reyland and become part of a growing community of smart real estate affiliates.
                        </Text>
                    </View>
                </View>

                    {/* Feature List */}
                    <View className="px-6 -mt-8">
                    <View className="bg-surface rounded-3xl border border-border p-5 shadow-sm">
                        {FEATURES.map((feature, index) => (
                        <View
                            key={feature.title}
                            className={`flex-row items-start ${
                            index !== FEATURES.length - 1 ? 'mb-5 pb-5 border-b border-border' : ''
                            }`}
                        >
                            <View className="w-11 h-11 rounded-full bg-primaryLight items-center justify-center mr-4">
                            <Ionicons name={feature.icon} size={20} color="#ffffff" />
                            </View>

                            <View className="flex-1">
                            <Text className="text-textPrimary text-base font-semibold mb-1">
                                {feature.title}
                            </Text>
                            <Text className="text-textSecondary text-sm leading-5">
                                {feature.description}
                            </Text>
                            </View>
                        </View>
                        ))}
                        
                    </View>
                    <View className="bg-surface rounded-3xl border border-border p-3 mt-5 shadow-sm">
                        <Text className="text-textSecondary text-center text-sm font-semibold mb-1">
                            Ready to start your affiliate journey? Secure your future today and unlock exclusive affiliate opportunities with Reyland.
                        </Text>
                    </View>
                    </View>


                    {/* Spacer pushes CTA down on tall screens */}
                    <View className="flex-1" />

                    {/* CTA Section */}
                    <View className="px-6 pt-8 pb-6">
                    <TouchableOpacity
                        onPress={onGetStarted}
                        activeOpacity={0.85}
                        className="bg-primary rounded-2xl py-4 items-center shadow-md"
                    >
                        <Text className="text-textOnDark text-base font-semibold">
                        Get Started
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-textMuted text-sm text-center mt-4 px-8">
                        By continuing, you agree to Reyland&apos;s Affiliate terms and data handling policy.
                    </Text>
                    </View>
            </ScrollView>   
        </SafeAreaView>
    );
}
