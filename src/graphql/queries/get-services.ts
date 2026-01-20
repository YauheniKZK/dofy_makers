import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
}

export interface Material {
  id: string
  name: string
}

export interface ServiceUser {
  id: string
  name: string
}

export interface ServiceSubcategory {
  id: string
  name: string
}

export interface Service {
  id: string
  userId: string
  user?: ServiceUser
  subcategoryId: string
  subcategory?: ServiceSubcategory
  name: string
  description: string | null
  price: number
  currency: string
  duration: number | null
  images: string[]
  isActive: boolean
  isPublished: boolean
  allowCoupons: boolean
  tags?: Tag[]
  materials?: Material[]
  favoritesCount?: number
  createdAt: string
  updatedAt: string
}

export interface GetServicesResult {
  services: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      services: Service[]
      total: number
    }
  }
}

export const GET_SERVICES = gql`
  query GetServices($userId: ID, $subcategoryId: ID, $limit: Int, $offset: Int) {
    services(userId: $userId, subcategoryId: $subcategoryId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        services {
          id
          userId
          user {
            id
            name
          }
          subcategoryId
          subcategory {
            id
            name
          }
          name
          description
          price
          currency
          duration
          images
          isActive
          isPublished
          allowCoupons
          tags {
            id
            name
          }
          materials {
            id
            name
          }
          favoritesCount
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
