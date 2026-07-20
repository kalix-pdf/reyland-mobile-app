import { useAuth } from '@/context/auth-context'
import { useAppTheme } from '@/context/theme-context'
import { User } from '@/types/user.types'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { clearCachedUser, setCachedUser } from '../../services/auth/auth-session'
import { deleteAccount } from '../../services/user/delete-account.api'
import { updateAvatar } from '../../services/user/update-avatar.api'
import { HeaderNav, HeaderShell, HomeAction } from '../header'
import { getInitials } from './get-initials'
import { getPhoneValue } from './phone-value'

type PersonalInformationViewProps = {
  user: User
  refreshing?: boolean
  onRefresh?: () => void
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

  return (
    <View className='min-h-[66px] flex-row items-center gap-3 py-3.5'>
      <View className='flex-1 gap-[5px]'>
        <Text className='text-xs font-semibold text-textMuted'>{label}</Text>
        <Text className='text-[15px] font-bold text-textPrimary leading-5'>{value}</Text>
      </View>
      {editable ? (
        <Pressable onPress={onPress} hitSlop={8}>
          {({ pressed }) => (
            <View className={`min-h-[32px] max-w-[180px] px-2.5 rounded-2xl flex-row items-center justify-center gap-1.5 bg-surfaceMuted ${
                pressed ? 'opacity-60' : ''
              }`}>
              <Text
                className='shrink text-xs font-semibold text-accent'
                numberOfLines={1}
              >{`Change ${label}`}</Text>
              <Feather name="edit" size={14} color={colors.accent} />
            </View>
          )}
        </Pressable>
      ) : null}
    </View>
  )
}

export function PersonalInformationView({ user, refreshing = false, onRefresh }: PersonalInformationViewProps) {
  const { colors } = useAppTheme()
  const { setUser } = useAuth()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteConfirmValue, setDeleteConfirmValue] = useState('')
  const initials = getInitials(user.name)
  const phone = getPhoneValue(user.phone)
  const phoneNumber = phone ?? 'Not provided'
  const roleLabel = user.role === 1 ? 'Investor' : user.role === 2 ? 'Pending Investor' : 'Buyer'
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
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'left', 'right', 'bottom']}>
      <HeaderShell transparent>
        <HeaderNav title='Personal Information' rightAction={<HomeAction />}/>
      </HeaderShell>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='px-5 pb-10'
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          ) : undefined
        }
      >
        <View className='items-center my-6'>
          <View className='w-[104px] h-[104px] rounded-[52px] bg-primary items-center justify-center overflow-hidden mb-2.5 border-2 border-surface'>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} className='w-full h-full' />
            ) : (
              <Text className='text-white text-[28px] font-bold'>{initials}</Text>
            )}
          </View>

          <Pressable onPress={handleChangePhoto}
            disabled={isUploadingAvatar} className={`min-h-[28px] px-2.5 rounded-[14px] flex-row items-center justify-center gap-[5px] bg-surfaceMuted mb-[18px] active:opacity-60 ${
              isUploadingAvatar ? 'opacity-50' : ''}`}>
            {isUploadingAvatar ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Feather name="edit" size={11} color={colors.accent} />
            )}
            <Text className='text-xs font-extrabold text-accent'>
              {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
            </Text>
          </Pressable>

          <Text className='text-xl font-extrabold text-textPrimary text-center uppercase mb-2'>
            {user.name}</Text>
          <Text className='text-sm text-textSecondary text-center'>
            {user.email} </Text>
        </View>

        <View className='w-full'>
          <InformationField label="Full Name" value={user.name} onPress={() => router.push('/profile/change-full-name')} />
          <InformationField label="Email" value={user.email} onPress={() => router.push('/profile/change-email')} />
          <InformationField label="Phone Number" value={phoneNumber} onPress={() => router.push('/profile/change-phone')}/>
          <InformationField label="Role" value={roleLabel} editable={false} />
          <InformationField
            label="Password"
            value="••••••••"
            onPress={() => router.push('/profile/change-password')}
            // isLast
          />
        </View>

        <Pressable onPress={handleDeleteAccount} 
        className='min-h-[54px] mt-6 rounded-[21px] border border-errorBorder bg-errorBackground flex-row items-center justify-center gap-2 active:opacity-60'>
          <Feather name="trash-2" size={18} color={colors.error} />
          <Text className='text-[15px] font-extrabold text-error'>Delete Account</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={!!selectedAvatar}
        transparent animationType="fade"
        onRequestClose={() => {
          if (!isUploadingAvatar) setSelectedAvatar(null)
        }}>
        <View className='flex-1 items-center justify-center px-5 bg-[rgba(17,24,39,0.62)]'>
          <View className='w-full max-w-[360px] rounded-lg bg-surface p-[18px] items-center border border-border'>
            <Text className='text-lg font-extrabold text-textPrimary mb-3.5'>Preview Photo</Text>

            {selectedAvatar?.uri ? (
              <Image source={{ uri: selectedAvatar.uri }} className='w-[188px] h-[188px] rounded-[94px] bg-surfaceMuted mb-3.5' />
            ) : null}

            <Text className='text-sm leading-5 text-textSecondary text-center mb-[18px]'>
              Use this cropped image as your profile photo?
            </Text>

            <View className='w-full flex-row gap-2.5'>
              <Pressable onPress={() => setSelectedAvatar(null)}
                disabled={isUploadingAvatar}
                className={`flex-1 min-h-[46px] rounded-lg border border-border bg-surface items-center justify-center active:opacity-60 ${
                  isUploadingAvatar ? 'opacity-50' : ''
                }`}>
                <Text className='text-sm font-extrabold text-textPrimary'>Cancel</Text>
              </Pressable>

              <Pressable onPress={handleConfirmAvatarUpload}
                disabled={isUploadingAvatar}
                className={`flex-1 min-h-[46px] rounded-lg bg-accent items-center justify-center active:opacity-60 ${
                  isUploadingAvatar ? 'opacity-50' : ''
                }`}>
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text className='text-sm font-extrabold text-background'>Use Photo</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteConfirmation}
        transparent animationType="fade"
        onRequestClose={() => {
          handleCloseDeleteConfirmation()
        }}>
        <View className='flex-1 items-center justify-center px-5 bg-[rgba(17,24,39,0.62)]'>
          <View className='w-full max-w-[360px] rounded-lg bg-surface p-[18px] items-center border border-border'>
            <Text className='text-lg font-extrabold text-textPrimary mb-3.5'>Delete Account</Text>
            <Text className='text-sm leading-5 text-textSecondary text-center mb-[18px]'>
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
              className='w-full min-h-[48px] rounded-lg border border-border bg-surface px-3.5 text-sm font-extrabold text-textPrimary mb-3.5 text-center'
            />

            <View className='w-full flex-row gap-2.5'>
              <Pressable
                onPress={handleCloseDeleteConfirmation}
                disabled={isDeletingAccount}
                className={`flex-1 min-h-[46px] rounded-lg border border-border bg-surface items-center justify-center active:opacity-60 ${
                  isDeletingAccount ? 'opacity-50' : ''
                }`}>
                <Text className='text-sm font-extrabold text-textPrimary'>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDeleteAccount}
                disabled={!canConfirmDelete || isDeletingAccount}
                className={`flex-1 min-h-[46px] rounded-lg bg-errorBackground border border-errorBorder items-center justify-center active:opacity-50 ${
                  !canConfirmDelete || isDeletingAccount ? 'opacity-60' : ''
                }`}>
                {isDeletingAccount ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <Text className='text-sm font-extrabold text-error'>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
