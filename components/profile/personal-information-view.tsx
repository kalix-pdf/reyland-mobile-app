import { useAppTheme } from '@/context/theme-context';
import { User } from '@/types/user.types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPersonalInformationStyles } from '../../styles/profile.styles';

type PersonalInformationViewProps = {
  user: User;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function InformationField({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const { colors } = useAppTheme();
  const styles = createPersonalInformationStyles(colors);

  return (
    <View style={[styles.fieldRow, isLast && styles.fieldRowLast]}>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );
}

export function PersonalInformationView({ user }: PersonalInformationViewProps) {
  const { colors } = useAppTheme();
  const styles = createPersonalInformationStyles(colors);
  const initials = getInitials(user.name);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerButton, pressed && styles.buttonPressed]}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>Personal Information</Text>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => [styles.headerButton, pressed && styles.buttonPressed]}
          hitSlop={10}
        >
          <Ionicons name="home" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSummary}>
          <View style={styles.avatar}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>

          <Pressable style={({ pressed }) => [styles.changePhotoButton, pressed && styles.buttonPressed]}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
            <Feather name="edit-2" size={11} color={colors.accent} />
          </Pressable>

          <Text style={styles.displayName}>{user.name}</Text>
          <Text style={styles.displayEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoPanel}>
          <InformationField label="Full Name" value={user.name} />
          <InformationField label="Email" value={user.email} isLast />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
