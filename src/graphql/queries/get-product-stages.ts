import gql from 'graphql-tag'

export interface Product {
  id: string
  name: string
}

export interface ProductStage {
  id: string
  productId: string
  product?: Product
  name: string
  description: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface GetProductStagesResult {
  productStages: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ProductStage[]
  }
}

export const GET_PRODUCT_STAGES = gql`
  query GetProductStages($productId: ID!) {
    productStages(productId: $productId) {
      successfully
      error
      message
      data {
        id
        productId
        product {
          id
          name
        }
        name
        description
        imageUrl
        videoUrl
        order
        createdAt
        updatedAt
      }
    }
  }
`
