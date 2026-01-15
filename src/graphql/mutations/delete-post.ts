import gql from 'graphql-tag'

export interface DeletePostResult {
  deletePost: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      successfully
      error
      message
    }
  }
`
