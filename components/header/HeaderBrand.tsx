import { useAppTheme } from '@/context/theme-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { getInitials } from '../profile/get-initials';
import { User } from '../../types/user.types';
import { sharedLoginPillBase, sharedLoginPillText, sharedSmallAvatarBase } from '@/styles/shared-primitives';

interface HeaderBrandProps {
    user?: User | null;
    onLogin?: () => void;
}

export function HeaderBrand({ user, onLogin }: HeaderBrandProps) {
    const { colors } = useAppTheme();

    return (
        <View className="flex-row justify-between items-center gap-3.5 pt-2.5">
            <Image
                source={require('@/assets/images/logo-header.png')}
                contentFit="contain"
                style={{width: 110, height: 32}}
                cachePolicy="memory-disk"
                priority="high"
                transition={200}
            />

            <View className="flex-row items-center flex-shrink-0">
                {user ? (
                    <View className="flex-row items-center gap-2 max-w-[180px]">
                        <Text
                            className="text-[13px] font-extrabold flex-shrink"
                            style={{ color: colors.textSecondary }}
                        >
                            Greetings, {getInitials(user.name)}!
                        </Text>
                        <Image
                            source={{ uri: user.avatar }}
                            style={[
                                sharedSmallAvatarBase,
                                {
                                    width: 42,
                                    height: 42,
                                    borderRadius: 100,
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
                        className="min-h-10 px-3.5 py-[9px] active:opacity-50"
                        style={[
                            sharedLoginPillBase,
                            {
                                backgroundColor: colors.primary,
                                borderColor: 'rgba(255,255,255,0.35)',
                            },
                        ]}
                        onPress={onLogin}
                        accessibilityLabel="Login"
                        accessibilityRole="button"
                    >
                        <Ionicons name="person-outline" size={15} color="#FFFFFF" />
                        <Text style={sharedLoginPillText}>Login</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}