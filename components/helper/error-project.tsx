import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorScreen({ message, onRetry }: Props) {
  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center gap-2 px-4 py-2.5 bg-errorBackground border-b-[0.5px] border-errorBorder">
        <Ionicons name="wifi-outline" size={16} color={Colors.error} />
        <Text className="flex-1 text-[13px] text-error">{message}</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8 gap-3">
        <View className="w-16 h-16 rounded-full bg-errorBackground items-center justify-center mb-1">
          <Ionicons name="cloud-offline-outline" size={32} color={Colors.error} />
        </View>

        <Text className="text-[17px] font-medium text-center">{message} :(</Text>

        <Text className="text-sm text-textMuted text-center leading-5 max-w-[260px]">
          Check your connection and try again. The data will appear here once it loads.
        </Text>

        <Pressable
          className="flex-row items-center gap-1.5 mt-1 py-2.5 px-6 rounded-lg bg-accent"
          onPress={onRetry}
        >
          <Ionicons name="refresh-outline" size={16} color={Colors.surface} />
          <Text className="text-sm font-medium text-surface">Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}