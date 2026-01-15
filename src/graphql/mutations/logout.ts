import gql from 'graphql-tag'

export interface LogoutResult {
  logout: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const LOGOUT = gql`
  mutation Logout($token: String!) {
    logout(token: $token) {
      successfully
      error
      message
    }
  }
`
