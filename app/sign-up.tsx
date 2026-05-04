import { useState } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SignUpForm } from '../components/auth/sign-up-form'
import { signInWithGoogle, GoogleAuthError } from '../services/auth/google'
import { getUserInfo } from '@/services/fetchData/user.api'
import { useAuth } from '@/context/auth-context'

export default function SignUpScreen() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { setUser } = useAuth();

  const handleGoogleSignUp = async () => {
    if (isGoogleLoading) return
    setIsGoogleLoading(true)

    try {
      const { token } = await signInWithGoogle()
      
      if (token) {
        const userInfo = await getUserInfo(token);

        if (userInfo.uuid) {
          await AsyncStorage.setItem('token', token)
          setUser(userInfo);
          router.replace('/')
        }
      }

    } catch (error) {
      if (error instanceof GoogleAuthError && error.code === 'CANCELLED') {
        return
      }

      Alert.alert(
        'Sign-in Failed',
        error instanceof GoogleAuthError
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <SignUpForm
      onSignUp={async (name, email, password) => {
        console.log('Sign up:', { name, email, password })
        return true
      }}
      onLogin={() => router.replace('/login')}
      onGoogleSignUp={handleGoogleSignUp}
      onFacebookSignUp={() => console.log('Facebook sign up')}
      isGoogleLoading={isGoogleLoading}
    />
  )
}