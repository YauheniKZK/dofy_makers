import gql from 'graphql-tag'

export interface SubscriptionUser {
  id: string
  name: string
  description?: string | null
}

export interface Subscription {
  id: string
  followerId: string
  follower?: SubscriptionUser
  followingId: string
  following?: SubscriptionUser
  createdAt: string
  updatedAt: string
}

export interface GetSubscriptionResult {
  subscription: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Subscription | null
  }
}

export const GET_SUBSCRIPTION = gql`
  query GetSubscription($id: ID!) {
    subscription(id: $id) {
      successfully
      error
      message
      data {
        id
        followerId
        follower {
          id
          name
        }
        followingId
        following {
          id
          name
          description
        }
        createdAt
        updatedAt
      }
    }
  }
`
