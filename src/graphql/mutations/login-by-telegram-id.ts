import gql from 'graphql-tag'
import { AuthPayload } from './create-tokens-user'

export interface LoginByTelegramIdResult {
  loginByTelegramId: {
    successfully: boolean
    message: string | null
    error: string | null
    data: AuthPayload | null
  }
}

export const LOGIN_BY_TELEGRAM_ID = gql`
  mutation LoginByTelegramId($telegramId: String!, $photoUrl: String) {
    loginByTelegramId(telegramId: $telegramId, photoUrl: $photoUrl) {
      successfully
      message
      error
      data {
        accessToken
        refreshToken
        user {
          id
          name
          email
          telegramId
          avatarUrl
          description
          shortDescription
          country
          city
          phone
          role {
            id
            name
            code
          }
        }
      }
    }
  }
`

