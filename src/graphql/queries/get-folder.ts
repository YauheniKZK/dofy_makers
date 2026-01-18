import gql from 'graphql-tag'

export interface FolderProduct {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  images: string[]
  isActive: boolean
  isPublished: boolean
}

export interface FolderService {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  duration: number | null
  images: string[]
  isActive: boolean
  isPublished: boolean
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

export interface GetFolderResult {
  folder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Folder | null
  }
}

export const GET_FOLDER = gql`
  query GetFolder($id: ID!) {
    folder(id: $id) {
      successfully
      error
      message
      data {
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
          isActive
          isPublished
        }
        services {
          id
          name
          description
          price
          currency
          duration
          images
          isActive
          isPublished
        }
        createdAt
        updatedAt
      }
    }
  }
`
