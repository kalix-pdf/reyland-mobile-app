import { useAppTheme } from '@/context/theme-context';
import { ReactNode, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

type AuthInputProps = TextInputProps & {
  error?: string;
  icon: (color: string) => ReactNode;
  rightElement?: (color: string) => ReactNode;
  label?: string;
};

export function AuthInput({ error, icon, rightElement, label, onFocus, onBlur, ...textInputProps }: AuthInputProps) {
  const { colors } = useAppTheme();

  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const iconColor = hasError ? colors.error : isFocused ? colors.accent : colors.textMuted;

  const wrapperBorderClass = hasError
    ? 'border-error'
    : isFocused
    ? 'border-accent'
    : 'border-border';

  return (
    <View> 
      {label ? (
        <Text className={`text-base font-semibold ${hasError ? 'text-error' : 'text-textPrimary'}`}>
          {label}
        </Text>
      ) : null}

      <View className={`min-h-14 flex-row items-center bg-transparent border-b px-0 ${wrapperBorderClass}`}>
        <View className="mr-2.5">
          {icon(iconColor)}
        </View>

        <TextInput
          {...textInputProps}
          className="flex-1 text-textPrimary text-[14px] py-3"
          placeholderTextColor={colors.textMuted}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {rightElement ? rightElement(iconColor) : null}
      </View>

      {error ? (
        <Text className="text-error text-sm font-bold mt-0.5"> {/* spacing.xxs guess */}
          {error}
        </Text>
      ) : null}
    </View>
  );
}