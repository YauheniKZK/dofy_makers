import gql from 'graphql-tag'

export interface TagSuggestion {
  id: string
  name: string
  type: string
  slug: string
}

export interface GetTagSuggestionsResult {
  tagSuggestions: {
    successfully: boolean
    error: string | null
    message: string | null
    data: TagSuggestion[]
  }
}

export const GET_TAG_SUGGESTIONS = gql`
  query GetTagSuggestions($query: String!, $type: TagType, $limit: Int) {
    tagSuggestions(query: $query, type: $type, limit: $limit) {
      successfully
      error
      message
      data {
        id
        name
        type
        slug
      }
    }
  }
`
