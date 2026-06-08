import { useAppTheme } from '@/context/theme-context';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';

interface HeaderSearchBarProps {
    value: string;
    onChange: (text: string) => void;
    onSubmit?: (text: string) => void;
    placeholder?: string;
    style?: ViewStyle;
    readonly?: boolean;
    onPress?: () => void;
}

/**
 * Standalone header search bar.
 *
 * Handles its own focus state so the parent stays clean.
 * Supports two modes:
 *   - interactive  → full TextInput with clear button (Discover / Projects tabs)
 *   - readonly     → Pressable shell that navigates to a search screen (Home tab)
 */
export function HeaderSearchBar({value, onChange, onSubmit, placeholder = 'Search by title or location',
    style, readonly = false, onPress }: HeaderSearchBarProps) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const { colors } = useAppTheme();

    const containerStyle = [
        styles.container,
        {
            backgroundColor: colors.surface,
            borderColor: focused ? colors.accent : colors.border,
        },
        style,
    ];

    if (readonly) {
        return (
            <Pressable
                style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
                onPress={onPress}
                accessibilityRole="search"
                accessibilityLabel={placeholder}
            >
                <Feather name="search" size={16} color={colors.textMuted} />
                <TextInput
                    style={[styles.input, { color: colors.textMuted }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    editable={false}
                    pointerEvents="none"
                />
            </Pressable>
        );
    }

    return (
        <Pressable style={containerStyle} onPress={() => inputRef.current?.focus()}>
            <Feather
                name="search"
                size={16}
                color={focused ? colors.accent : colors.textMuted}
            />
            <TextInput
                ref={inputRef}
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
            />
            {value.length > 0 && (
                <Pressable
                    onPress={() => onChange('')}
                    hitSlop={8}
                    accessibilityLabel="Clear search"
                >
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </Pressable>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        height: 40,
        marginTop: 5,
        gap: 8,
        marginBottom: 14
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 10,
    },
    pressed: {
        opacity: 0.7,
    },
});