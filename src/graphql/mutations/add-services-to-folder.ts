import gql from 'graphql-tag'
import type { Folder } from '../queries/get-folder'

export interface AddServicesToFolderInput {
  folderId: string
  serviceIds: string[]
}

export interface AddServicesToFolderResult {
  addServicesToFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const ADD_SERVICES_TO_FOLDER = gql`
  mutation AddServicesToFolder($input: AddServicesToFolderInput!) {
    addServicesToFolder(input: $input) {
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
