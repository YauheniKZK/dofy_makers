import gql from 'graphql-tag'

export interface LikeUser {
  id: string
  name: string
}

export interface Like {
  id: string
  userId: string
  user?: LikeUser
  likeableType: string
  likeableId: string
  createdAt: string
}

export interface LikeInput {
  likeableType: string
  likeableId: string
}

export interface LikeResult {
  like: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Like | null
  }
}

export const LIKE = gql`
  mutation Like($input: LikeInput!) {
    like(input: $input) {
      successfully
      error
      message
      data {
        id
        userId
        user {
          id
          name
        }
        likeableType
        likeableId
        createdAt
      }
    }
  }
`
