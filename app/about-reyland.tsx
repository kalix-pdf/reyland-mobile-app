import { HeaderNav } from '@/components/header';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const appFeatures = [
  'View available farm lots and subdivided properties',
  'Create and manage Buyer Accounts and Investor Accounts, if applicable',
  'Access account statements and payment-related updates',
  'Make reservations for available properties',
  'Send inquiries and contact support directly',
  'Receive announcements, notifications, and updates',
  'Monitor account activities and transactions',
];

function BulletItem({ text }: { text: string }) {
  return (
    <View className="flex-row gap-2.5 items-start">
      <Text className="text-[14px] leading-[22px] text-textSecondary">{'\u2022'}</Text>
      <Text className="flex-1 text-[14px] leading-[22px] font-medium text-textSecondary">{text}</Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="border-b border-border pb-5">
      <Text className="text-base leading-[22px] font-black text-textPrimary mb-2">{title}</Text>
      {children}
    </View>
  );
}

export default function AboutReylandScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="px-5">
        <HeaderNav title="About Reyland PH" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="rounded-2xl border border-border bg-surface px-4 py-4 mb-5">
          <Text className="text-2xl leading-[30px] font-black text-textPrimary">About Reyland PH</Text>
          <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-3">
            Welcome to Reyland PH.
          </Text>
          <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-3">
            Based in Minantok West, Amadeo, Cavite 4119, Reyland PH is engaged in the development of farm lots and
            subdivided properties, providing opportunities for buyers and investors through accessible and organized
            property services.
          </Text>
        </View>

        <View className="gap-5">
          <Section title="Reyland PH Mobile Application">
            <Text className="text-[14px] leading-[22px] font-medium text-textSecondary">
              The Reyland PH Mobile Application was developed to provide a more convenient and efficient way for
              clients to access services and stay connected with property updates. Through the application, buyers and
              investors can manage their accounts and interact with available services anytime and anywhere.
            </Text>
          </Section>

          <Section title="What Users Can Do">
            <View className="gap-1">
              {appFeatures.map((feature) => (
                <BulletItem key={feature} text={feature} />
              ))}
            </View>
          </Section>

          <Section title="For Administrators">
            <Text className="text-[14px] leading-[22px] font-medium text-textSecondary">
              For administrators, the application serves as a platform to manage activities, process transactions,
              monitor client engagement, and provide timely updates and assistance.
            </Text>
          </Section>

          <Section title="Our Commitment">
            <Text className="text-[14px] leading-[22px] font-medium text-textSecondary">
              At Reyland PH, we aim to make property ownership and investment more accessible through innovation,
              transparency, and reliable service.
            </Text>
          </Section>

          <Section title="Details">
            <Text className="text-[14px] leading-[22px] font-medium text-textSecondary">
              Location: Minantok West, Amadeo, Cavite 4119
            </Text>
            <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-1">
              Application: Reyland PH Mobile Application
            </Text>
          </Section>
        </View>

        <Text className="text-center text-xs font-semibold text-textMuted mt-7">
          Reyland PH Mobile Application
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
