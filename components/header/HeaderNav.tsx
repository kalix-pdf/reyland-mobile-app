import { useAppTheme } from '@/context/theme-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HeaderNavProps {
    title: string;
    onBack?: () => void;
    showBack?: boolean;
    rightAction?: ReactNode;
    borderBottom?: boolean;
}

/**
 * Single-row navigation header used on interior / detail screens.
 *
 * Examples:
 *   <HeaderNav title="Personal Information" rightAction={<HomeButton />} />
 *   <HeaderNav title="Property Details" showBack />
 *   <HeaderNav title="Edit Project" onBack={handleUnsavedChanges} />
 */
export function HeaderNav({title, onBack, showBack = true, rightAction, borderBottom = false }: HeaderNavProps) {
    const { colors } = useAppTheme();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <View style={[styles.row, 
            !borderBottom && {borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth},
            { backgroundColor: colors.background}]}>
            {showBack && (
                <Pressable
                    onPress={handleBack}
                    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                    hitSlop={10}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </Pressable>
            )}

            <Text style={[styles.title, { color: colors.textPrimary }]}
                numberOfLines={1}
                accessibilityRole="header">
                {title}
            </Text>

            
            {rightAction ?? null}
        </View>
    );
}

export function HomeAction() {
    const { colors } = useAppTheme();
    return (
        <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            hitSlop={10}
            accessibilityLabel="Go to home"
            accessibilityRole="button"
        >
            <Ionicons name="home" size={20} color={colors.textPrimary} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        minHeight: 58,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    side: {
        width: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    sideRight: {
        alignItems: 'flex-end',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
    },
    iconButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.5,
    },
});