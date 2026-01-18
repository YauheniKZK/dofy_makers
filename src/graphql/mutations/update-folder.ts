import gql from 'graphql-tag'

export interface UpdateFolderInput {
  folderId: string
  name?: string
  description?: string
}

export interface UpdatedFolder {
  id: string
  name: string
  description: string | null
  updatedAt: string
}

export interface UpdateFolderResult {
  updateFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UpdatedFolder | null
  }
}

export const UPDATE_FOLDER = gql`
  mutation UpdateFolder($input: UpdateFolderInput!) {
    updateFolder(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        updatedAt
      }
    }
  }
`
