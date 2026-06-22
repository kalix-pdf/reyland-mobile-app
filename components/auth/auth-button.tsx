import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type AuthButtonProps = {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AuthButton({
  title,
  loadingTitle = 'Loading...',
  loading = false,
  disabled = false,
  onPress,
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className="rounded-full overflow-hidden bg-primary min-h-[52px] items-center justify-center"
      style={({ pressed }) => [
        pressed && !isDisabled && { opacity: 0.9, transform: [{ scale: 0.985 }] },
        isDisabled && { opacity: 0.75 },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color="white" size="small" />
          <Text className="text-white text-[15px] font-black">{loadingTitle}</Text>
        </View>
      ) : (
        <Text className="text-white text-[15px] font-black">{title}</Text>
      )}
    </Pressable>
  );
}