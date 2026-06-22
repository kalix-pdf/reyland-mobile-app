// AuthMessage.tsx
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type AuthMessageProps = {
  type: 'error' | 'success';
  message?: string;
};

export function AuthMessage({ type, message }: AuthMessageProps) {
  const { colors } = useAppTheme();

  if (!message) return null;

  const isError = type === 'error';

  return (
    <View
      className={`flex-row items-center gap-2 border rounded-2xl px-3.5 py-3 mb-3.5 ${
        isError ? 'bg-errorBackground border-errorBorder' : 'bg-rentBadge border-border'
      }`}
    >
      <Ionicons
        name={isError ? 'alert-circle-outline' : 'checkmark-circle-outline'}
        size={18}
        color={isError ? colors.error : colors.success}
      />

      <Text className={`flex-1 text-[13px] font-bold ${isError ? 'text-error' : 'text-success'}`}>
        {message}
      </Text>
    </View>
  );
}