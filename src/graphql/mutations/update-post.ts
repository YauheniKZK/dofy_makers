import gql from 'graphql-tag'

export interface UpdatePostInput {
  postId: string
  title?: string
  content?: string
  images?: string[]
  isPublished?: boolean
  isActive?: boolean
  tagIds?: string[]
}

export interface UpdatedPost {
  id: string
  title: string
  content: string | null
  images: string[]
  updatedAt: string
}

export interface UpdatePostResult {
  updatePost: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UpdatedPost | null
  }
}

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      successfully
      error
      message
      data {
        id
        title
        content
        images
        updatedAt
      }
    }
  }
`
