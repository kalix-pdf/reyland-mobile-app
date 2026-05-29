import { useAppTheme } from '@/context/theme-context'
import { User } from '@/types/user.types'
import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createPersonalInformationStyles } from '../../styles/profile.styles'

type PersonalInformationViewProps = {
  user: User
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function InformationField({
  label,
  value,
  actionLabel,
  onPress,
  editable = true,
  isLast = false,
}: {
  label: string
  value: string
  actionLabel?: string
  onPress?: () => void
  editable?: boolean
  isLast?: boolean
}) {
  const { colors } = useAppTheme()
  const styles = createPersonalInformationStyles(colors)

  return (
    <View style={[styles.fieldRow, isLast && styles.fieldRowLast]}>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value }</Text>
      </View>
      {editable ? (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.editAction, pressed && styles.buttonPressed]}
          hitSlop={8}
        >
          <Text style={styles.editActionText}>{actionLabel ?? `Change ${label}`}</Text>
          <Feather name="edit" size={14} color={colors.accent} />
        </Pressable>
      ) : null}
    </View>
  )
}

export function PersonalInformationView({ user }: PersonalInformationViewProps) {
  const { colors } = useAppTheme()
  const styles = createPersonalInformationStyles(colors)
  const initials = getInitials(user.name)
  const phoneNumber = user.phone || 'Not provided'

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action is irreversible. Are you sure you want to delete your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ])
  }

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
            <Feather name="edit" size={11} color={colors.accent} />
          </Pressable>

          <Text style={styles.displayName}>{user.name}</Text>
          <Text style={styles.displayEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoPanel}>
          <InformationField label="Full Name" value={user.name} onPress={() => router.push('/change-full-name')} />
          <InformationField label="Email" value={user.email} onPress={() => router.push('/change-email')} />
          <InformationField
            label="Phone Number"
            value={phoneNumber}
            actionLabel="Change Phone"
            onPress={() => router.push('/change-phone')}
          />
          <InformationField label="Role" value="Investor" editable={false} />
          <InformationField
            label="Password"
            value="••••••••"
            actionLabel="Change Password"
            onPress={() => router.push('/change-password')}
            isLast
          />
        </View>

        <Pressable
          onPress={handleDeleteAccount}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
        >
          <Feather name="trash-2" size={18} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
