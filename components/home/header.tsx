import { View, Text, Pressable } from 'react-native';
import { User } from '../../types/user.types';
import { createHeaderStyles } from '../../styles/header.styles';
import { Colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getInitials } from '../profile/get-initials';

const styles = createHeaderStyles(Colors);

interface HeaderProps {
    mode: 'account' | 'home' | 'properties';
    user?: User | null;
    onLogin?: () => void;
}

export function Header({ mode, user, onLogin }: HeaderProps) {
    const insets = useSafeAreaInsets();
    const today = new Date().toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    switch (mode) {
        case 'account':
            return (
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Account</Text>
                </View>
            );
        case 'home':
            return (
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <View style={styles.headerTop}>
                        <View style={styles.logo}>
                            <Text style={styles.logo}>Reyland PH</Text>
                        </View>

                        <View style={styles.userSection}>
                        {user ? (
                            <View style={styles.user}>
                                <Text> Greetings, {getInitials(user.name)}!</Text>
                                <Image source={{ uri: user?.avatar }}
                                    style={styles.avatar}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    priority="normal"
                                    transition={200}
                                />
                            </View>
                            ) : (
                            <Pressable
                                style={({ pressed }) => [styles.loginPill, pressed && styles.headerActionPressed]}
                                onPress={onLogin}
                            >
                                <Ionicons name="person-outline" size={16} color="#FFFFFF" />
                                <Text style={styles.loginPillText}>Login</Text>
                            </Pressable>
                        )}
                        </View>
                    </View>

                    <Text style={styles.dateText}>{today}</Text>
                </View>
            );
        case 'properties':
            return (
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Properties</Text>
                </View>
            );
        default:
            return null;
    }
  

}