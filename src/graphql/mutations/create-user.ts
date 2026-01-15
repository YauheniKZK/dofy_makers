import gql from 'graphql-tag'

export interface RegisterUserByTelegramInput {
  telegramId: string
  firstName?: string
  lastName?: string
  photoUrl?: string
  description?: string
  shortDescription?: string
  country?: string
  city?: string
  phone?: string
}

export interface RegisteredUser {
  id: string
  telegramId: string | null
  name: string
  activated: boolean
  avatarUrl?: string | null
  description?: string | null
  shortDescription?: string | null
  country?: string | null
  city?: string | null
  phone?: string | null
  role: {
    id: string
    code: string
    name: string
  }
  createdAt: string
}

export interface RegisterUserResult {
  registerUserByTelegram: {
    successfully: boolean
    message: string | null
    error: string | null
    data: RegisteredUser | null
  }
}

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserByTelegramInput!) {
    registerUserByTelegram(input: $input) {
      successfully
      message
      error
      data {
        id
        telegramId
        name
        activated
        description
        shortDescription
        country
        city
        phone
        role {
          id
          code
          name
        }
        createdAt
      }
    }
  }
`

