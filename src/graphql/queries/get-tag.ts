import gql from 'graphql-tag'
import { Tag } from './get-tags'

export interface GetTagResult {
  tag: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Tag | null
  }
}

export const GET_TAG = gql`
  query GetTag($id: ID!) {
    tag(id: $id) {
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
