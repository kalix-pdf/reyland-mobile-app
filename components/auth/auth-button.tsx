import { useAppTheme } from '@/context/theme-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { createAuthComponentStyles } from '../../styles/auth.styles';

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
  const { colors } = useAppTheme();
  const styles = createAuthComponentStyles(colors);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={[colors.accent, colors.accentDark, colors.primary]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.buttonFill}
      >
        {loading ? (
          <View style={styles.buttonLoadingRow}>
            <ActivityIndicator color={colors.white} size="small" />
            <Text style={styles.buttonText}>{loadingTitle}</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
