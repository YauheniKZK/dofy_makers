import gql from 'graphql-tag'

export interface IsLikedResult {
  isLiked: {
    successfully: boolean
    error: string | null
    message: string | null
    data: boolean
  }
}

export const IS_LIKED = gql`
  query IsLiked($userId: ID!, $likeableType: LikeableType!, $likeableId: ID!) {
    isLiked(userId: $userId, likeableType: $likeableType, likeableId: $likeableId) {
      successfully
      error
      message
      data
    }
  }
`
