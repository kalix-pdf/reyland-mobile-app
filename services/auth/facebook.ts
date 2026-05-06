import * as WebBrowser from 'expo-web-browser'
import { BACKEND_URL, REDIRECT_URI, AuthError, AuthResult } from './AuthResult'

WebBrowser.maybeCompleteAuthSession()

export async function signInWithFacebook(): Promise<AuthResult> {
  // Encode the redirect URI so the backend knows where to send the token back
  const authUrl = `${BACKEND_URL}/api/auth/facebook?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI)

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new AuthError('Sign-in was cancelled', 'CANCELLED')
  }

  if (result.type !== 'success') {
    throw new AuthError('Unexpected auth session result', 'NETWORK')
  }

  let token: string | null = null
  try {
    const url = new URL(result.url)
    token = url.searchParams.get('access_token')
  } catch {
    throw new AuthError('Could not parse redirect URL', 'INVALID_RESPONSE')
  }

  if (!token || token.trim() === '') {
    throw new AuthError('No token returned from backend', 'INVALID_RESPONSE')
  }

  return { token }
}
