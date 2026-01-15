import gql from 'graphql-tag'

export interface UnlikeResult {
  unlike: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const UNLIKE = gql`
  mutation Unlike($likeableType: LikeableType!, $likeableId: ID!) {
    unlike(likeableType: $likeableType, likeableId: $likeableId) {
      successfully
      error
      message
    }
  }
`
