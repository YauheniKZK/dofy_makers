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
  updatedAt: string
}

export interface GetLikesResult {
  likes: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      likes: Like[]
      total: number
    }
  }
}

export const GET_LIKES = gql`
  query GetLikes($likeableType: LikeableType!, $likeableId: ID!, $limit: Int, $offset: Int) {
    likes(likeableType: $likeableType, likeableId: $likeableId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        likes {
          id
          userId
          user {
            id
            name
          }
          likeableType
          likeableId
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
