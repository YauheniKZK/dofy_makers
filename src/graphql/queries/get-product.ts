import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
  slug: string
}

export interface MaterialGroup {
  id: string
  name: string
}

export interface Material {
  id: string
  name: string
  description: string | null
  materialGroup?: MaterialGroup
}

export interface ProductUser {
  id: string
  name: string
  description: string | null
}

export interface ProductCategory {
  id: string
  name: string
}

export interface ProductSubcategory {
  id: string
  name: string
  category?: ProductCategory
}

export interface ProductStage {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
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
  stages?: ProductStage[]
  createdAt: string
  updatedAt: string
}

export interface GetProductResult {
  product: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Product | null
  }
}

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      successfully
      error
      message
      data {
        id
        userId
        user {
          id
          name
          description
        }
        subcategoryId
        subcategory {
          id
          name
          category {
            id
            name
          }
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
          slug
        }
        materials {
          id
          name
          description
          materialGroup {
            id
            name
          }
        }
        stages {
          id
          name
          description
          imageUrl
          videoUrl
          order
        }
        createdAt
        updatedAt
      }
    }
  }
`
