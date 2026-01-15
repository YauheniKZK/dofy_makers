import gql from 'graphql-tag'

export interface KnowledgeSubcategory {
  id: string
  name: string
  description: string | null
}

export interface KnowledgeCategory {
  id: string
  name: string
  description: string | null
  slug: string
  sortOrder: number
  isActive: boolean
  subcategories?: KnowledgeSubcategory[]
  createdAt: string
  updatedAt: string
}

export interface GetKnowledgeCategoriesResult {
  knowledgeCategories: {
    successfully: boolean
    error: string | null
    message: string | null
    data: KnowledgeCategory[]
  }
}

export const GET_KNOWLEDGE_CATEGORIES = gql`
  query GetKnowledgeCategories($includeInactive: Boolean) {
    knowledgeCategories(includeInactive: $includeInactive) {
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
        createdAt
        updatedAt
      }
    }
  }
`
