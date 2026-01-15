import gql from 'graphql-tag'

export interface PostWithLikes {
  id: string
  title: string
  likesCount: number
}

export interface DecrementPostLikesResult {
  decrementPostLikes: {
    successfully: boolean
    error: string | null
    message: string | null
    data: PostWithLikes | null
  }
}

export const DECREMENT_POST_LIKES = gql`
  mutation DecrementPostLikes($postId: ID!) {
    decrementPostLikes(postId: $postId) {
      successfully
      error
      message
      data {
        id
        title
        likesCount
      }
    }
  }
`
