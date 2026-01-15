import gql from 'graphql-tag'
import { Category } from './get-categories'

export interface GetCategoryResult {
  category: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Category | null
  }
}

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
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
