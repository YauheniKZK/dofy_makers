import gql from 'graphql-tag'

export interface GetLikeCountResult {
  likeCount: {
    successfully: boolean
    error: string | null
    message: string | null
    data: number
  }
}

export const GET_LIKE_COUNT = gql`
  query GetLikeCount($likeableType: LikeableType!, $likeableId: ID!) {
    likeCount(likeableType: $likeableType, likeableId: $likeableId) {
      successfully
      error
      message
      data
    }
  }
`
