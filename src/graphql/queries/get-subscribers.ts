import gql from 'graphql-tag'

export interface SubscriberUser {
  id: string
  name: string
  description?: string | null
}

export interface Subscription {
  id: string
  followerId: string
  follower?: SubscriberUser
  followingId: string
  following?: SubscriberUser
  createdAt: string
}

export interface GetSubscribersResult {
  subscribers: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      subscriptions: Subscription[]
      total: number
    }
  }
}

export const GET_SUBSCRIBERS = gql`
  query GetSubscribers($userId: ID!, $limit: Int, $offset: Int) {
    subscribers(userId: $userId, limit: $limit, offset: $offset) {
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
            description
          }
          followingId
          following {
            id
            name
          }
          createdAt
        }
        total
      }
    }
  }
`
