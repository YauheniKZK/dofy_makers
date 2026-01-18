import gql from 'graphql-tag'
import type { Folder } from '../queries/get-folder'

export interface AddProductsToFolderInput {
  folderId: string
  productIds: string[]
}

export interface AddProductsToFolderResult {
  addProductsToFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const ADD_PRODUCTS_TO_FOLDER = gql`
  mutation AddProductsToFolder($input: AddProductsToFolderInput!) {
    addProductsToFolder(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        products {
          id
          name
          price
          currency
          description
          images
        }
        services {
          id
          name
        }
      }
    }
  }
`
