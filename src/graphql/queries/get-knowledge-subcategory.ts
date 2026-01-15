import gql from 'graphql-tag'
import { KnowledgeSubcategory } from './get-knowledge-subcategories'

export interface GetKnowledgeSubcategoryResult {
  knowledgeSubcategory: {
    successfully: boolean
    error: string | null
    message: string | null
    data: KnowledgeSubcategory | null
  }
}

export const GET_KNOWLEDGE_SUBCATEGORY = gql`
  query GetKnowledgeSubcategory($id: ID!) {
    knowledgeSubcategory(id: $id) {
      successfully
      error
      message
      data {
        id
        categoryId
        category {
          id
          name
        }
        name
        description
        slug
        sortOrder
        isActive
      }
    }
  }
`
