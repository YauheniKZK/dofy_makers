import gql from 'graphql-tag'

export interface Category {
  id: string
  name: string
}

export interface Subcategory {
  id: string
  categoryId: string
  category?: Category
  name: string
  description: string | null
  slug: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetSubcategoriesResult {
  subcategories: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Subcategory[]
  }
}

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($categoryId: ID, $includeInactive: Boolean) {
    subcategories(categoryId: $categoryId, includeInactive: $includeInactive) {
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
