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

export interface ProductUser {
  id: string
  name: string
}

export interface ProductSubcategory {
  id: string
  name: string
}

export interface Product {
  id: string
  userId: string
  user?: ProductUser
  subcategoryId: string
  subcategory?: ProductSubcategory
  name: string
  description: string | null
  price: number
  currency: string
  images: string[]
  isActive: boolean
  isPublished: boolean
  allowCoupons: boolean
  tags?: Tag[]
  materials?: Material[]
  createdAt: string
  updatedAt: string
}

export interface GetProductsResult {
  products: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      products: Product[]
      total: number
    }
  }
}

export const GET_PRODUCTS = gql`
  query GetProducts($userId: ID, $subcategoryId: ID, $limit: Int, $offset: Int) {
    products(userId: $userId, subcategoryId: $subcategoryId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        products {
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
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
