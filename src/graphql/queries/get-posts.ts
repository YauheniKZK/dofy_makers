import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
}

export interface PostUser {
  id: string
  name: string
  description: string | null
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

export interface GetPostsResult {
  posts: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      posts: Post[]
      total: number
    }
  }
}

export const GET_POSTS = gql`
  query GetPosts($userId: ID, $isPublished: Boolean, $limit: Int, $offset: Int) {
    posts(userId: $userId, isPublished: $isPublished, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        posts {
          id
          userId
          user {
            id
            name
            description
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
          }
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
