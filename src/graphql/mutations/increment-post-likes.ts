import gql from 'graphql-tag'

export interface PostWithLikes {
  id: string
  title: string
  likesCount: number
}

export interface IncrementPostLikesResult {
  incrementPostLikes: {
    successfully: boolean
    error: string | null
    message: string | null
    data: PostWithLikes | null
  }
}

export const INCREMENT_POST_LIKES = gql`
  mutation IncrementPostLikes($postId: ID!) {
    incrementPostLikes(postId: $postId) {
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
