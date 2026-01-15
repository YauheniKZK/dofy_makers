import gql from 'graphql-tag'

export interface UnsubscribeResult {
  unsubscribe: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($followingId: ID!) {
    unsubscribe(followingId: $followingId) {
      successfully
      error
      message
    }
  }
`
