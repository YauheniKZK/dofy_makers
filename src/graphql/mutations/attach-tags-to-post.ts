import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
}

export interface PostWithTags {
  id: string
  title: string
  tags?: Tag[]
}

export interface AttachTagsToPostInput {
  postId: string
  tagIds: string[]
}

export interface AttachTagsToPostResult {
  attachTagsToPost: {
    successfully: boolean
    error: string | null
    message: string | null
    data: PostWithTags | null
  }
}

export const ATTACH_TAGS_TO_POST = gql`
  mutation AttachTagsToPost($input: AttachTagsToPostInput!) {
    attachTagsToPost(input: $input) {
      successfully
      error
      message
      data {
        id
        title
        tags {
          id
          name
          type
        }
      }
    }
  }
`
