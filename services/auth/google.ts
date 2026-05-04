import { User } from '@/types/user'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession()

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL is not defined')
}

const REDIRECT_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME ?? 'reylandapp'
const REDIRECT_URI = `${REDIRECT_SCHEME}://auth/callback`

export interface GoogleAuthResult {
  token: string
  // refreshToken: string;
}

export class GoogleAuthError extends Error {
  constructor(
    message: string,
    public readonly code: 'CANCELLED' | 'NETWORK' | 'INVALID_RESPONSE'
  ) {
    super(message)
    this.name = 'GoogleAuthError'
  }
}

export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  // Encode the redirect URI so the backend knows where to send the token back
  const authUrl = `${BACKEND_URL}/api/auth/google?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI)

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new GoogleAuthError('Sign-in was cancelled', 'CANCELLED')
  }

  if (result.type !== 'success') {
    throw new GoogleAuthError('Unexpected auth session result', 'NETWORK')
  }

  let token: string | null = null
  try {
    const url = new URL(result.url)
    token = url.searchParams.get('access_token')
  } catch {
    throw new GoogleAuthError('Could not parse redirect URL', 'INVALID_RESPONSE')
  }

  if (!token || token.trim() === '') {
    throw new GoogleAuthError('No token returned from backend', 'INVALID_RESPONSE')
  }

  return { token }
}


// export async function getUserInfo(): Promise<User>