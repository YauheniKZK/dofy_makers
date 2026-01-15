import gql from 'graphql-tag'

export interface TagSynonym {
  id: string
  synonym: string
}

export interface Tag {
  id: string
  name: string
  type: string
  description: string | null
  slug: string
  isActive: boolean
  synonyms?: TagSynonym[]
  createdAt: string
  updatedAt: string
}

export interface GetTagsResult {
  tags: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Tag[]
  }
}

export const GET_TAGS = gql`
  query GetTags($type: TagType, $search: String, $limit: Int) {
    tags(type: $type, search: $search, limit: $limit) {
      successfully
      error
      message
      data {
        id
        name
        type
        description
        slug
        isActive
        synonyms {
          id
          synonym
        }
        createdAt
        updatedAt
      }
    }
  }
`
