import gql from 'graphql-tag'

export interface KnowledgeCategory {
  id: string
  name: string
}

export interface KnowledgeSubcategory {
  id: string
  categoryId: string
  category?: KnowledgeCategory
  name: string
  description: string | null
  slug: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetKnowledgeSubcategoriesResult {
  knowledgeSubcategories: {
    successfully: boolean
    error: string | null
    message: string | null
    data: KnowledgeSubcategory[]
  }
}

export const GET_KNOWLEDGE_SUBCATEGORIES = gql`
  query GetKnowledgeSubcategories($categoryId: ID, $includeInactive: Boolean) {
    knowledgeSubcategories(categoryId: $categoryId, includeInactive: $includeInactive) {
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
        createdAt
        updatedAt
      }
    }
  }
`
