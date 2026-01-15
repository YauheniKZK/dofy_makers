import gql from 'graphql-tag'
import { KnowledgeCategory } from './get-knowledge-categories'

export interface GetKnowledgeCategoryResult {
  knowledgeCategory: {
    successfully: boolean
    error: string | null
    message: string | null
    data: KnowledgeCategory | null
  }
}

export const GET_KNOWLEDGE_CATEGORY = gql`
  query GetKnowledgeCategory($id: ID!) {
    knowledgeCategory(id: $id) {
      successfully
      error
      message
      data {
        id
        name
        description
        slug
        sortOrder
        isActive
        subcategories {
          id
          name
          description
        }
      }
    }
  }
`
