import gql from 'graphql-tag'

export interface PostWithViews {
  id: string
  title: string
  views: number
}

export interface IncrementPostViewsResult {
  incrementPostViews: {
    successfully: boolean
    error: string | null
    message: string | null
    data: PostWithViews | null
  }
}

export const INCREMENT_POST_VIEWS = gql`
  mutation IncrementPostViews($postId: ID!) {
    incrementPostViews(postId: $postId) {
      successfully
      error
      message
      data {
        id
        title
        views
      }
    }
  }
`
