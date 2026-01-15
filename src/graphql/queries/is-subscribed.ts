import gql from 'graphql-tag'

export interface IsSubscribedResult {
  isSubscribed: {
    successfully: boolean
    error: string | null
    message: string | null
    data: boolean
  }
}

export const IS_SUBSCRIBED = gql`
  query IsSubscribed($followerId: ID!, $followingId: ID!) {
    isSubscribed(followerId: $followerId, followingId: $followingId) {
      successfully
      error
      message
      data
    }
  }
`
