import gql from 'graphql-tag'
import type { Folder } from '../queries/get-folder'

export interface AddProductToFolderInput {
  folderId: string
  productId: string
}

export interface AddProductToFolderResult {
  addProductToFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const ADD_PRODUCT_TO_FOLDER = gql`
  mutation AddProductToFolder($input: AddProductToFolderInput!) {
    addProductToFolder(input: $input) {
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
