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

export interface GetSubscriptionsResult {
  subscriptions: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      subscriptions: Subscription[]
      total: number
    }
  }
}

export const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions($userId: ID!, $limit: Int, $offset: Int) {
    subscriptions(userId: $userId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        subscriptions {
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
        total
      }
    }
  }
`
