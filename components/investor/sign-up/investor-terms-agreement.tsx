import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type InvestorTermsAgreementProps = {
  agreed: boolean;
  onToggle: () => void;
};

export function InvestorTermsAgreement({ agreed, onToggle }: InvestorTermsAgreementProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-start gap-2.5 rounded-xl border border-border bg-surfaceMuted p-3 mb-[18px] active:opacity-65"
      hitSlop={4}
    >
      <View
        className={`w-[19px] h-[19px] rounded-[5px] border-[1.5px] items-center justify-center mt-px ${
          agreed ? 'bg-accent border-accent' : 'border-border'
        }`}
      >
        {agreed ? <Ionicons name="checkmark" size={12} color={colors.white} /> : null}
      </View>
      <Text className="flex-1 text-[12.5px] leading-[18px] text-textSecondary font-semibold">
        I agree to the investor{' '}
        <Text
          className="text-accent font-extrabold"
          onPress={(event) => {
            event.stopPropagation();
            router.push('/terms-and-conditions');
          }}
        >
          terms and conditions
        </Text>
        ,{' '}
        <Text
          className="text-accent font-extrabold"
          onPress={(event) => {
            event.stopPropagation();
            router.push('/privacy-policy');
          }}
        >
          privacy policy
        </Text>
        , and eligibility review.
      </Text>
    </Pressable>
  );
}