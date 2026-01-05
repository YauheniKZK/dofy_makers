import gql from 'graphql-tag'

export interface RegisterUserByTelegramInput {
  telegramId: string
  name?: string
}

export interface RegisteredUser {
  id: string
  telegramId: string | null
  name: string
  activated: boolean
  role: {
    code: string
    name: string
  }
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
        role {
          code
          name
        }
      }
    }
  }
`

