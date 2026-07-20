import { HeaderNav } from '@/components/header';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PolicySection = {
  title: string;
  body?: string[];
  groups?: {
    title: string;
    items: string[];
  }[];
  items?: string[];
};

const policySections: PolicySection[] = [
  {
    title: '1. Information We Collect',
    body: ['To provide our services, we may collect the following information:'],
    groups: [
      {
        title: 'Personal Information',
        items: [
          'Full name',
          'Mobile number',
          'Email address',
          'Residential address, if applicable',
          'Valid identification documents, when required',
        ],
      },
      {
        title: 'Account Information',
        items: [
          'Buyer account details',
          'Investor account details',
          'Login credentials and account preferences',
        ],
      },
      {
        title: 'Transaction Information',
        items: [
          'Reservation details',
          'Property inquiry records',
          'Account statements and payment-related information',
          'Transaction history',
        ],
      },
      {
        title: 'Device and Technical Information',
        items: [
          'Device type and operating system',
          'IP address',
          'Application usage logs',
          'App performance and analytics information',
        ],
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: ['Your information may be used to:'],
    items: [
      'Create and manage your account',
      'Process reservations and inquiries',
      'Provide buyer and investor services',
      'Display account statements and transaction records',
      'Send announcements, updates, and notifications',
      'Improve application performance and user experience',
      'Respond to customer support concerns',
      'Maintain platform security and prevent unauthorized access',
      'Comply with applicable legal and regulatory requirements',
    ],
  },
  {
    title: '3. Sharing of Information',
    body: ['Reyland PH does not sell personal information.', 'Your information may only be shared:'],
    items: [
      'With authorized employees and administrators for service operations',
      'With service providers supporting the application and system functions',
      'When required by law or government authorities',
      'To protect legal rights, users, and business operations',
    ],
  },
  {
    title: '4. Data Storage and Protection',
    body: [
      'We implement reasonable administrative, technical, and organizational measures to protect your information against:',
    ],
    items: ['Unauthorized access', 'Disclosure', 'Loss or destruction', 'Alteration or misuse'],
  },
  {
    title: '5. User Rights',
    body: ['Subject to applicable laws, users may request to:'],
    items: [
      'Access their personal information',
      'Correct inaccurate information',
      'Update account details',
      'Request deletion or closure of their account',
      'Withdraw consent where applicable',
    ],
  },
  {
    title: '6. Account Responsibilities',
    body: ['Users are responsible for:'],
    items: [
      'Maintaining confidentiality of account credentials',
      'Providing accurate information',
      'Reporting unauthorized account activity immediately',
    ],
  },
  {
    title: '7. Cookies and Analytics',
    body: [
      'The application may use analytics and similar technologies to improve performance, understand user interactions, and enhance services.',
    ],
  },
  {
    title: '8. Updates to This Privacy Policy',
    body: [
      'Reyland PH may update this Privacy Policy periodically. Changes become effective once published within the application.',
      'Continued use of the application constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: '9. Contact Information',
    body: ['For questions regarding this Privacy Policy, contact:', 'Reyland PH', 'Minantok West, Amadeo, Cavite 4119'],
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

function Section({ section }: { section: PolicySection }) {
  return (
    <View className="border-b border-border pb-5">
      <Text className="text-base leading-[22px] font-black text-textPrimary mb-2">{section.title}</Text>

      {section.body?.map((paragraph) => (
        <Text key={paragraph} className="text-[14px] leading-[22px] font-medium text-textSecondary mb-2">
          {paragraph}
        </Text>
      ))}

      {section.groups?.map((group) => (
        <View key={group.title} className="mt-3">
          <Text className="text-[13px] leading-[18px] font-black text-textPrimary mb-1.5">{group.title}</Text>
          <View className="gap-1">
            {group.items.map((item) => (
              <BulletItem key={item} text={item} />
            ))}
          </View>
        </View>
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

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="px-5">
        <HeaderNav title="Privacy Policy" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="rounded-2xl border border-border bg-surface px-4 py-4 mb-5">
          <Text className="text-2xl leading-[30px] font-black text-textPrimary">Privacy Policy</Text>
          <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-3">
            Welcome to Reyland PH. Your privacy is important to us. This Privacy Policy explains how the Reyland PH
            Mobile Application collects, uses, stores, and protects your information when you access and use our
            services.
          </Text>
          <Text className="text-[14px] leading-[22px] font-medium text-textSecondary mt-3">
            By using the application, you agree to the practices described in this Privacy Policy.
          </Text>
        </View>

        <View className="gap-5">
          {policySections.map((section) => (
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
