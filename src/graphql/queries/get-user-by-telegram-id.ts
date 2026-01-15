import gql from 'graphql-tag'
import { User } from './get-authenticated-user'

export interface GetUserByTelegramIdResult {
  userByTelegramId: {
    successfully: boolean
    data: User | null
    error: string | null
    message: string | null
  }
}

export const GET_USER_BY_TELEGRAM_ID = gql`
  query GetUserByTelegramId($telegramId: String!) {
    userByTelegramId(telegramId: $telegramId) {
      successfully
      message
      data {
        id
        name
        email
        telegramId
        activated
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
          description
        }
        blockReasons {
          id
          name
          description
          isActive
        }
        createdAt
        updatedAt
      }
      error
    }
  }
`

