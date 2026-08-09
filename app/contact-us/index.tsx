import { HeaderNav } from '@/components/header';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContactItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    href: string;
}

const CONTACT_DETAILS: ContactItem[] = [
    {
        icon: 'call-outline',
        label: 'Phone',
        value: '+63 987 654 3210',
        href: 'tel:0987 654 3210'
    },
    {
        icon: 'mail-open-outline',
        label: 'Email',
        value: 'ctotops@gmail.com',
        href: 'mailto:ctotops@gmail.com'
    },
    {
        icon: 'logo-facebook',
        label: 'Facebook',
        value: 'Reyland Development PH',
        href: 'https://www.facebook.com/profile.php?id=61560879789214'
    }
]

function ContactInformation() {
  return (
    <View className="rounded-2xl border border-border bg-surface px-4 py-2">
      {CONTACT_DETAILS.map((item, index) => (
        <Pressable
          key={item.label}
          onPress={() => Linking.openURL(item.href)}
          className={`flex-row items-center py-3 active:opacity-70 ${
            index !== CONTACT_DETAILS.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-accent/10">
            <Ionicons name={item.icon} size={18} color={Colors.accent} />
          </View>

          <View className="flex-1">
            <Text className="text-textSecondary">{item.label}</Text>
            <Text className="text-textPrimary font-medium mt-0.5">{item.value}</Text>
          </View>

          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}


export default function ContactUSScreen() {
    return (
        <SafeAreaView className='flex-1 bg-background' edges={['top', 'left', 'right']}>
            <View className="px-5">
                <HeaderNav title="Contact Us" />
            </View>

            <ScrollView className="px-5 mt-4" showsVerticalScrollIndicator={false}>
                <ContactInformation />
            </ScrollView>
            
        </SafeAreaView>
    );
}