export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  throw new Error('EXPO_PUBLIC_BACKEND_URL is not defined')
}

export const REDIRECT_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME ?? 'reylandapp'
export const REDIRECT_URI = `${REDIRECT_SCHEME}://auth/callback`

export interface AuthResult {
  token: string
  // refreshToken: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: 'CANCELLED' | 'NETWORK' | 'INVALID_RESPONSE'
  ) {
    super(message)
    this.name = 'GoogleAuthError'
  }
}