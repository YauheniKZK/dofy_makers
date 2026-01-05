import gql from 'graphql-tag'

export interface ActivatedUser {
  id: string
  telegramId: string | null
  name: string
  firstName: string | null
  lastName: string | null
  activated: boolean
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
  mutation ActivateUser($telegramId: String!) {
    activateUser(telegramId: $telegramId) {
      successfully
      message
      error
      data {
        id
        telegramId
        name
        firstName
        lastName
        activated
      }
    }
  }
`

