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
      className={`rounded-full overflow-hidden min-h-[52px] items-center justify-center ${
        isDisabled ? 'bg-border' : 'bg-primary'
      }`}
      style={({ pressed }) => [
        pressed && !isDisabled && {
          opacity: 0.9,
          transform: [{ scale: 0.985 }],
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator
            color={isDisabled ? '#9CA3AF' : 'white'}
            size="small"
          />
          <Text
            className={`text-[15px] font-black ${
              isDisabled ? 'text-textMuted' : 'text-white'
            }`}
          >
            {loadingTitle}
          </Text>
        </View>
      ) : (
        <Text
          className={`text-[15px] font-black ${
            isDisabled ? 'text-textMuted' : 'text-white'
          }`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}