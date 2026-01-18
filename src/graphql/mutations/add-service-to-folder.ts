import gql from 'graphql-tag'
import type { Folder } from '../queries/get-folder'

export interface AddServiceToFolderInput {
  folderId: string
  serviceId: string
}

export interface AddServiceToFolderResult {
  addServiceToFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const ADD_SERVICE_TO_FOLDER = gql`
  mutation AddServiceToFolder($input: AddServiceToFolderInput!) {
    addServiceToFolder(input: $input) {
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
          price
          currency
          duration
          description
          images
        }
      }
    }
  }
`
