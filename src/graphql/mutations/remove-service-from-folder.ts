import gql from 'graphql-tag'
import type { Folder } from '../queries/get-folder'

export interface RemoveServiceFromFolderInput {
  folderId: string
  serviceId: string
}

export interface RemoveServiceFromFolderResult {
  removeServiceFromFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const REMOVE_SERVICE_FROM_FOLDER = gql`
  mutation RemoveServiceFromFolder($input: RemoveServiceFromFolderInput!) {
    removeServiceFromFolder(input: $input) {
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
