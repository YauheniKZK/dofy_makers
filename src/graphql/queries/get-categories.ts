import gql from 'graphql-tag'

export interface Subcategory {
  id: string
  name: string
  description: string | null
  slug: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  slug: string
  sortOrder: number
  isActive: boolean
  subcategories?: Subcategory[]
  createdAt: string
  updatedAt: string
}

export interface GetCategoriesResult {
  categories: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Category[]
  }
}

export const GET_CATEGORIES = gql`
  query GetCategories($includeInactive: Boolean) {
    categories(includeInactive: $includeInactive) {
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
          slug
        }
        createdAt
        updatedAt
      }
    }
  }
`
