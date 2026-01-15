import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
}

export interface PostWithTags {
  id: string
  title: string
  tags?: Tag[]
}

export interface RemoveTagFromPostInput {
  postId: string
  tagId: string
}

export interface RemoveTagFromPostResult {
  removeTagFromPost: {
    successfully: boolean
    error: string | null
    message: string | null
    data: PostWithTags | null
  }
}

export const REMOVE_TAG_FROM_POST = gql`
  mutation RemoveTagFromPost($input: RemoveTagFromPostInput!) {
    removeTagFromPost(input: $input) {
      successfully
      error
      message
      data {
        id
        title
        tags {
          id
          name
        }
      }
    }
  }
`
