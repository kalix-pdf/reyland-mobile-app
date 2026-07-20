import { HeaderNav } from '@/components/header';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TermsSection = {
  title: string;
  body?: string[];
  items?: string[];
};

const termsSections: TermsSection[] = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By creating an account or using Reyland PH, you confirm that you have read, understood, and agree to these Terms and Conditions, including any future updates.',
    ],
  },
  {
    title: '2. Description of Service',
    body: ['Reyland PH is a mobile application designed to provide users access to:'],
    items: [
      'Farm lot and subdivided property listings',
      'Buyer and investor account management',
      'Account statements and transaction updates',
      'Property reservations and inquiries',
      'Communication with administrators',
      'Notifications and announcements',
    ],
  },
  {
    title: '3. User Accounts',
    body: [
      'Users may register as Buyer Account, Investor Account, or both if applicable.',
      'Users agree to:',
    ],
    items: [
      'Provide accurate and complete information',
      'Maintain confidentiality of login credentials',
      'Be responsible for all activities under their account',
    ],
  },
  {
    title: '4. Reservations and Transactions',
    items: [
      'Property reservations are subject to availability and approval',
      'All transactions and agreements may require verification from authorized personnel',
      'Reyland PH reserves the right to reject or cancel any reservation due to incomplete requirements or policy violations',
    ],
  },
  {
    title: '5. User Responsibilities',
    body: ['Users agree NOT to:'],
    items: [
      'Use the app for fraudulent or illegal activities',
      'Attempt to hack, disrupt, or damage the system',
      'Provide false information or misrepresentation',
      'Interfere with other users’ access or experience',
    ],
  },
  {
    title: '6. Intellectual Property',
    body: [
      'All content within the application, including logos, design, text, images, and system features, are owned by Reyland PH unless otherwise stated. Unauthorized use is strictly prohibited.',
    ],
  },
  {
    title: '7. Account Statements and Information Accuracy',
    body: [
      'While Reyland PH strives to ensure accuracy of account statements and property information:',
    ],
    items: [
      'Minor delays or discrepancies may occur',
      'Users are encouraged to verify information through official channels',
      'The company is not liable for decisions made solely based on app data without confirmation',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: ['Reyland PH shall not be held liable for:'],
    items: [
      'Service interruptions or downtime',
      'Data loss due to technical issues',
      'Damages resulting from misuse of the application',
      'External factors beyond reasonable control',
    ],
  },
  {
    title: '9. Termination of Access',
    body: ['Reyland PH reserves the right to suspend or terminate access to users who:'],
    items: [
      'Violate these Terms',
      'Engage in suspicious or harmful activity',
      'Provide fraudulent information',
    ],
  },
  {
    title: '10. Updates to Terms',
    body: [
      'These Terms and Conditions may be updated at any time. Continued use of the application means acceptance of the revised terms.',
    ],
  },
  {
    title: '11. Governing Law',
    body: [
      'These Terms shall be governed by and interpreted in accordance with the laws of the Philippines.',
    ],
  },
  {
    title: '12. Contact Information',
    body: ['For questions or concerns:', 'Reyland PH', 'Minantok West, Amadeo, Cavite 4119'],
  },
];

function BulletItem({ text }: { text: string }) {
  return (
    <View className="flex-row gap-2.5 items-start">
      <Text className="text-[14px] leading-[22px] text-textSecondary">{'\u2022'}</Text>
      <Text className="flex-1 text-[14px] leading-[22px] font-medium text-textSecondary">{text}</Text>
    </View>
  );
}

function Section({ section }: { section: TermsSection }) {
  return (
    <View className="border-b border-border pb-5">
      <Text className="text-base leading-[22px] font-black text-textPrimary mb-2">{section.title}</Text>

      {section.body?.map((paragraph) => (
        <Text key={paragraph} className="text-[14px] leading-[22px] font-medium text-textSecondary mb-2">
          {paragraph}
        </Text>
      ))}

      {section.items ? (
        <View className="gap-1 mt-1">
          {section.items.map((item) => (
            <BulletItem key={item} text={item} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function TermsAndConditionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="px-5">
        <HeaderNav title="Terms and Conditions" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="rounded-2xl border border-border bg-surface px-4 py-4 mb-5">
          <Text className="text-2xl leading-[30px] font-black text-textPrimary">Terms and Conditions</Text>
          <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-3">
            Welcome to Reyland PH Mobile Application. By accessing or using this application, you agree to comply
            with and be bound by the following Terms and Conditions.
          </Text>
          <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-3">
            If you do not agree, please do not use the application.
          </Text>
        </View>

        <View className="gap-5">
          {termsSections.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </View>

        <Text className="text-center text-xs font-semibold text-textMuted mt-7">
          Reyland PH Mobile Application
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
