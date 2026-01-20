import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
}

export interface MaterialGroup {
  id: string
  name: string
}

export interface Material {
  id: string
  name: string
  materialGroup?: MaterialGroup
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

export interface GetServiceResult {
  service: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Service | null
  }
}

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      successfully
      error
      message
      data {
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
          type
        }
        materials {
          id
          name
          materialGroup {
            id
            name
          }
        }
        favoritesCount
        createdAt
        updatedAt
      }
    }
  }
`
