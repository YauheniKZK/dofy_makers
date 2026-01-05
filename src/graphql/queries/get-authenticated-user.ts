import gql from 'graphql-tag'

export interface User {
  id: string
  name: string
  email: string | null
  telegramId: string | null
  activated: boolean
  role: {
    id: string
    name: string
    code: string
    description: string | null
  }
  createdAt: string
  updatedAt: string
}

export interface GetAuthenticatedUserResult {
  me: {
    successfully: boolean
    data: User | null
    error: string | null
    message: string | null
  }
}

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      successfully
      message
      data {
        id
        name
        email
        telegramId
        activated
        role {
          id
          name
          code
        }
        createdAt
        updatedAt
      }
      error
    }
  }
`
