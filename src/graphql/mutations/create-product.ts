import gql from 'graphql-tag'

export interface CreateProductInput {
  subcategoryId: string
  name: string
  description?: string
  price: number
  currency: string
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
  tagIds?: string[]
  materialIds?: string[]
}

export interface CreatedProduct {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  images: string[]
  isActive: boolean
  isPublished: boolean
  createdAt: string
}

export interface CreateProductResult {
  createProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedProduct | null
  }
}

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        price
        currency
        images
        isActive
        isPublished
        createdAt
      }
    }
  }
`
