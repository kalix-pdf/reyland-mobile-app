import { useAppTheme } from '@/context/theme-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getInitials } from '../profile/get-initials';
import { User } from '../../types/user.types';
import { sharedHeaderActionPressed, sharedLoginPillBase, sharedLoginPillText, sharedSmallAvatarBase } from '@/styles/shared-primitives';

interface HeaderBrandProps {
    user?: User | null;
    onLogin?: () => void;
}

export function HeaderBrand({ user, onLogin }: HeaderBrandProps) {
    const { colors } = useAppTheme();

    return (
        <View style={styles.row}>
            <Image
                source={require('@/assets/images/logo-header.png')}
                contentFit="contain"
                style={styles.logo}
                cachePolicy="memory-disk"
                priority="high"
                transition={200}
            />

            <View style={styles.userSection}>
                {user ? (
                    <View style={styles.userRow}>
                        <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
                            Greetings, {getInitials(user.name)}!
                        </Text>
                        <Image
                            source={{ uri: user.avatar }}
                            style={[
                                styles.avatar,
                                {
                                    backgroundColor: colors.primaryLight,
                                    borderColor: colors.border,
                                },
                            ]}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            priority="normal"
                            transition={200}
                        />
                    </View>
                ) : (
                    <Pressable
                        style={({ pressed }) => [
                            styles.loginPill,
                            { backgroundColor: colors.accent },
                            pressed && styles.pressed,
                        ]}
                        onPress={onLogin}
                        accessibilityLabel="Login"
                        accessibilityRole="button"
                    >
                        <Ionicons name="person-outline" size={15} color="#FFFFFF" />
                        <Text style={styles.loginPillText}>Login</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14,
        paddingTop: 10
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        maxWidth: 180,
    },
    greetingText: {
        fontSize: 13,
        fontWeight: '800',
        flexShrink: 1,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
    },
    loginPillText: sharedLoginPillText,
    loginPill: {
        ...sharedLoginPillBase,
        minHeight: 40,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    headerActionPressed: sharedHeaderActionPressed,
    avatar: {
        ...sharedSmallAvatarBase,
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    logo: {
        width: 110,
        height: 32,
    },
    pressed: {
        opacity: 0.75,
    },
});