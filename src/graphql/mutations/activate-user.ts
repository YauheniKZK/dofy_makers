import gql from 'graphql-tag'

export interface ActivatedUser {
  id: string
  telegramId: string | null
  name: string
  activated: boolean
  role: {
    code: string
    name: string
  }
}

export interface ActivateUserResult {
  activateUser: {
    successfully: boolean
    message: string | null
    error: string | null
    data: ActivatedUser | null
  }
}

export const ACTIVATE_USER = gql`
  mutation ActivateUser($userId: ID!) {
    activateUser(userId: $userId) {
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

