import gql from 'graphql-tag'

export interface CreateFolderInput {
  name: string
  description?: string
}

export interface CreatedFolder {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateFolderResult {
  createFolder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedFolder | null
  }
}

export const CREATE_FOLDER = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        userId
        createdAt
        updatedAt
      }
    }
  }
`
