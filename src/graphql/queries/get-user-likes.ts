import gql from 'graphql-tag'

export interface UserLike {
  id: string
  userId: string
  likeableType: string
  likeableId: string
  createdAt: string
}

export interface GetUserLikesResult {
  userLikes: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      likes: UserLike[]
      total: number
    }
  }
}

export const GET_USER_LIKES = gql`
  query GetUserLikes($userId: ID!, $likeableType: LikeableType, $limit: Int, $offset: Int) {
    userLikes(userId: $userId, likeableType: $likeableType, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        likes {
          id
          userId
          likeableType
          likeableId
          createdAt
        }
        total
      }
    }
  }
`
