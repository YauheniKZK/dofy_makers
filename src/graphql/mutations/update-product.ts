import gql from 'graphql-tag'

export interface UpdateProductInput {
  productId: string
  name?: string
  description?: string
  price?: number
  currency?: string
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
  tagIds?: string[]
  materialIds?: string[]
}

export interface UpdatedProduct {
  id: string
  name: string
  description: string | null
  price: number
  updatedAt: string
}

export interface UpdateProductResult {
  updateProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UpdatedProduct | null
  }
}

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        price
        updatedAt
      }
    }
  }
`
