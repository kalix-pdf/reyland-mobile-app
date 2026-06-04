import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHeaderStyles } from '../../styles/header.styles';
import { User } from '../../types/user.types';
import { getInitials } from '../profile/get-initials';

const styles = createHeaderStyles(Colors);

interface HeaderProps {
    mode: 'account' | 'home' | 'properties';
    user?: User | null;
    onLogin?: () => void;
    search?: string;
    onSearchChange?: (text: string) => void;
}

export function Header({ mode, user, onLogin, search = '', onSearchChange }: HeaderProps) {
    const insets = useSafeAreaInsets();
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    switch (mode) {
        case 'account':
            return (
                <View style={styles.headerAccount}>
                    <Text style={styles.headerAccountTitle}>Account</Text>
                </View>
            );
        case 'home':
            return (
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <View style={styles.headerTop}>
                        <View>
                            <Image source={require('@/assets/images/logo-header.png')}
                                contentFit="contain"
                                style={styles.logoImage}
                                cachePolicy="memory-disk"
                                priority="normal"
                                transition={200}
                            />
                        </View>

                        <View style={styles.userSection}>
                        {user ? (
                            <View style={styles.user}>
                                <Text style={styles.greetingText}> Greetings, {getInitials(user.name)}!</Text>
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

                    {/* Search */}
                    <View style={[styles.searchRow, isSearchFocused && styles.searchRowFocused]}>
                        <Feather
                            name="search"
                            size={16}
                            color={isSearchFocused ? Colors.accent : Colors.textMuted}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by title or location"
                            placeholderTextColor={Colors.textMuted}
                            value={search}
                            onChangeText={onSearchChange}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            returnKeyType="search"
                        />
                        {search.length > 0 && (
                        <Pressable onPress={() => onSearchChange?.('')} hitSlop={8}>
                            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                        </Pressable>
                        )}
                    </View>
                </View>
            );
        case 'properties':
        return (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore Projects</Text>

                <View style={[styles.searchRow, isSearchFocused && styles.searchRowFocused]}>
                    <Feather
                        name="search"
                        size={16}
                        color={isSearchFocused ? Colors.accent : Colors.textMuted}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by title or location"
                        placeholderTextColor={Colors.textMuted}
                        value={search}
                        onChangeText={onSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        returnKeyType="search"
                    />
                    {/* {search.length > 0 && (
                        <Pressable onPress={() => onSearchChange?.('')} hitSlop={8}>
                            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                        </Pressable>
                    )} */}
                </View>
            </View>
        );
        default:
            return null;
    }
  

}