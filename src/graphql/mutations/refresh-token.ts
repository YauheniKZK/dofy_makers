import gql from 'graphql-tag'
import { AuthPayload } from './create-tokens-user'

export interface RefreshTokenResult {
  refreshToken: {
    successfully: boolean
    data: AuthPayload | null
    error: string | null
    message: string | null
  }
}

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      successfully
      data
      error
      message
    }
  }
`
