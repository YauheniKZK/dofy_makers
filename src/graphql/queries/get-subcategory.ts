import gql from 'graphql-tag'
import { Subcategory } from './get-subcategories'

export interface GetSubcategoryResult {
  subcategory: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Subcategory | null
  }
}

export const GET_SUBCATEGORY = gql`
  query GetSubcategory($id: ID!) {
    subcategory(id: $id) {
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
