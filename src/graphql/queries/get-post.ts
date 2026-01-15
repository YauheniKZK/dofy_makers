import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
  slug: string
}

export interface PostUser {
  id: string
  name: string
  telegramId: string | null
}

export interface Post {
  id: string
  userId: string
  user?: PostUser
  title: string
  content: string | null
  images: string[]
  isPublished: boolean
  isActive: boolean
  views: number
  likesCount: number
  tags?: Tag[]
  createdAt: string
  updatedAt: string
}

export interface GetPostResult {
  post: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Post | null
  }
}

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      successfully
      error
      message
      data {
        id
        userId
        user {
          id
          name
          telegramId
        }
        title
        content
        images
        isPublished
        isActive
        views
        likesCount
        tags {
          id
          name
          type
          slug
        }
        createdAt
        updatedAt
      }
    }
  }
`
