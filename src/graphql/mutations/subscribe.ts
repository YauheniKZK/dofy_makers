import gql from 'graphql-tag'

export interface SubscribeUser {
  id: string
  name: string
}

export interface Subscription {
  id: string
  followerId: string
  follower?: SubscribeUser
  followingId: string
  following?: SubscribeUser
  createdAt: string
  updatedAt: string
}

export interface SubscribeInput {
  followingId: string
}

export interface SubscribeResult {
  subscribe: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Subscription | null
  }
}

export const SUBSCRIBE = gql`
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
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
        }
        createdAt
        updatedAt
      }
    }
  }
`
