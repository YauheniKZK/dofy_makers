import gql from 'graphql-tag'

export interface DeleteFolderResult {
  deleteFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: boolean | null
  }
}

export const DELETE_FOLDER = gql`
  mutation DeleteFolder($folderId: ID!) {
    deleteFolder(folderId: $folderId) {
      successfully
      error
      message
      data
    }
  }
`
