import gql from 'graphql-tag'

export interface FolderProduct {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  images: string[]
}

export interface FolderService {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  duration: number | null
  images: string[]
}

export interface FolderUser {
  id: string
  name: string
  email?: string
}

export interface Folder {
  id: string
  name: string
  description: string | null
  userId: string
  user?: FolderUser
  products?: FolderProduct[]
  services?: FolderService[]
  createdAt: string
  updatedAt: string
}

export interface GetFoldersResult {
  folders: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      folders: Folder[]
      total: number
    } | null
  }
}

export const GET_FOLDERS = gql`
  query GetFolders($userId: ID, $limit: Int, $offset: Int) {
    folders(userId: $userId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        folders {
          id
          name
          description
          userId
          user {
            id
            name
            email
          }
          products {
            id
            name
            description
            price
            currency
            images
          }
          services {
            id
            name
            description
            price
            currency
            duration
            images
          }
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
