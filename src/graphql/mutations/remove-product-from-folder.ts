import gql from 'graphql-tag'
import type { Folder } from '../queries/get-folder'

export interface RemoveProductFromFolderInput {
  folderId: string
  productId: string
}

export interface RemoveProductFromFolderResult {
  removeProductFromFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const REMOVE_PRODUCT_FROM_FOLDER = gql`
  mutation RemoveProductFromFolder($input: RemoveProductFromFolderInput!) {
    removeProductFromFolder(input: $input) {
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
        }
        services {
          id
          name
        }
      }
    }
  }
`
