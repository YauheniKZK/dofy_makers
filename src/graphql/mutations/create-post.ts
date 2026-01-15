import gql from 'graphql-tag'

export interface CreatePostInput {
  title: string
  content?: string
  images?: string[]
  isPublished?: boolean
  isActive?: boolean
  tagIds?: string[]
}

export interface CreatedPost {
  id: string
  title: string
  content: string | null
  images: string[]
  isPublished: boolean
  views: number
  likesCount: number
  tags?: Array<{
    id: string
    name: string
  }>
  createdAt: string
}

export interface CreatePostResult {
  createPost: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedPost | null
  }
}

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      successfully
      error
      message
      data {
        id
        title
        content
        images
        isPublished
        views
        likesCount
        tags {
          id
          name
        }
        createdAt
      }
    }
  }
`
