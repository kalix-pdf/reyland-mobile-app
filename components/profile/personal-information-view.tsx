import { useAuth } from '@/context/auth-context'
import { useAppTheme } from '@/context/theme-context'
import { User } from '@/types/user.types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { clearCachedUser, setCachedUser } from '../../services/auth/auth-session'
import { deleteAccount } from '../../services/user/delete-account.api'
import { updateAvatar } from '../../services/user/update-avatar.api'
import { createPersonalInformationStyles } from '../../styles/profile.styles'
import { getInitials } from './get-initials'
import { getPhoneValue } from './phone-value'

type PersonalInformationViewProps = {
  user: User
}

function InformationField({ label, value, onPress, editable = true}: {
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
    <View style={[styles.fieldRow]}>
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
          <Text style={styles.editActionText} numberOfLines={1}>{`Change ${label}`}</Text>
          <Feather name="edit" size={14} color={colors.accent} />
        </Pressable>
      ) : null}
    </View>
  )
}

export function PersonalInformationView({ user }: PersonalInformationViewProps) {
  const { colors } = useAppTheme()
  const { setUser } = useAuth()
  const styles = createPersonalInformationStyles(colors)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteConfirmValue, setDeleteConfirmValue] = useState('')
  const initials = getInitials(user.name)
  const phone = getPhoneValue(user.phone)
  const phoneNumber = phone ?? 'Not provided'
  const canConfirmDelete = deleteConfirmValue.trim().toUpperCase() === 'DELETE'

const handleChangePhoto = async () => {
  if (isUploadingAvatar) return

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) {
    Alert.alert('Permission Needed', 'Please allow photo access to update your profile photo.')
    return
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  })

  if (result.canceled) return

  const asset = result.assets[0]
  if (!asset?.uri) return

  setSelectedAvatar(asset)
}

const handleConfirmAvatarUpload = async () => {
  if (!selectedAvatar?.uri || isUploadingAvatar) return

  const name = selectedAvatar.fileName ?? `avatar-${Date.now()}.jpg`
  const type = selectedAvatar.mimeType ?? 'image/jpeg'
  
  try {
    setSelectedAvatar(null)
    setIsUploadingAvatar(true)

    const updated = await updateAvatar({
      uri: selectedAvatar.uri,
      name,
      type,
    })
    
    if (!updated.avatar) {
      throw new Error('Profile photo update did not return an image URL.')
    }

    const nextUser = { ...user, avatar: updated.avatar }
    setUser(nextUser)
    await setCachedUser(nextUser)

    Alert.alert('Photo Updated', updated.message)
  } catch (error) {
    Alert.alert(
      'Upload Failed',
      error instanceof Error ? error.message : 'Unable to update your profile photo right now.',
    )
  } finally {
    setIsUploadingAvatar(false)
  }
}

  const handleDeleteAccount = () => {
    setDeleteConfirmation(true)
  }

  const handleCloseDeleteConfirmation = () => {
    if (isDeletingAccount) return

    setDeleteConfirmation(false)
    setDeleteConfirmValue('')
  }

  const handleConfirmDeleteAccount = async () => {
    if (!canConfirmDelete || isDeletingAccount) return

    try {
      setIsDeletingAccount(true)
      const result = await deleteAccount()

      setDeleteConfirmation(false)
      setDeleteConfirmValue('')
      await AsyncStorage.multiRemove(['token', 'refreshToken'])
      await clearCachedUser()
      setUser(null)
      Alert.alert('Account Deleted', result.message)
      router.replace('/')
    } catch (error) {
      Alert.alert(
        'Delete Failed',
        error instanceof Error ? error.message : 'Unable to delete your account right now.',
      )
    } finally {
      setIsDeletingAccount(false)
    }
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

          <Pressable
            onPress={handleChangePhoto}
            disabled={isUploadingAvatar}
            style={({ pressed }) => [
              styles.changePhotoButton,
              pressed && !isUploadingAvatar && styles.buttonPressed,
              isUploadingAvatar && styles.buttonDisabled,
            ]}
          >
            {isUploadingAvatar ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Feather name="edit" size={11} color={colors.accent} />
            )}
            <Text style={styles.changePhotoText}>
              {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
            </Text>
          </Pressable>

          <Text style={styles.displayName}>{user.name}</Text>
          <Text style={styles.displayEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoPanel}>
          <InformationField label="Full Name" value={user.name} onPress={() => router.push('/change-full-name')} />
          <InformationField label="Email" value={user.email} onPress={() => router.push('/change-email')} />
          <InformationField label="Phone Number" value={phoneNumber} onPress={() => router.push('/change-phone')}/>
          <InformationField label="Role" value={user.role === 0 ? 'Buyer' : 'Investor'} editable={false} />
          <InformationField
            label="Password"
            value="••••••••"
            onPress={() => router.push('/change-password')}
            // isLast
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

      <Modal
        visible={!!selectedAvatar}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isUploadingAvatar) setSelectedAvatar(null)
        }}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview Photo</Text>

            {selectedAvatar?.uri ? (
              <Image source={{ uri: selectedAvatar.uri }} style={styles.previewImage} />
            ) : null}

            <Text style={styles.previewText}>
              Use this cropped image as your profile photo?
            </Text>

            <View style={styles.previewActions}>
              <Pressable
                onPress={() => setSelectedAvatar(null)}
                disabled={isUploadingAvatar}
                style={({ pressed }) => [
                  styles.previewCancelButton,
                  pressed && !isUploadingAvatar && styles.buttonPressed,
                  isUploadingAvatar && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.previewCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmAvatarUpload}
                disabled={isUploadingAvatar}
                style={({ pressed }) => [
                  styles.previewConfirmButton,
                  pressed && !isUploadingAvatar && styles.buttonPressed,
                  isUploadingAvatar && styles.buttonDisabled,
                ]}
              >
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text style={styles.previewConfirmText}>Use Photo</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => {
          handleCloseDeleteConfirmation()
        }}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Delete Account</Text>
            <Text style={styles.previewText}>
              This action is permanent. Type DELETE to confirm you want to continue.
            </Text>

            <TextInput
              value={deleteConfirmValue}
              onChangeText={(value) => setDeleteConfirmValue(value.toUpperCase())}
              placeholder="Type DELETE"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isDeletingAccount}
              style={styles.previewInput}
            />

            <View style={styles.previewActions}>
              <Pressable
                onPress={handleCloseDeleteConfirmation}
                disabled={isDeletingAccount}
                style={({ pressed }) => [
                  styles.previewCancelButton,
                  pressed && !isDeletingAccount && styles.buttonPressed,
                  isDeletingAccount && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.previewCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDeleteAccount}
                disabled={!canConfirmDelete || isDeletingAccount}
                style={({ pressed }) => [
                  styles.previewDangerButton,
                  pressed && canConfirmDelete && !isDeletingAccount && styles.buttonPressed,
                  (!canConfirmDelete || isDeletingAccount) && styles.buttonDisabled,
                ]}
              >
                {isDeletingAccount ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <Text style={styles.previewDangerText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
