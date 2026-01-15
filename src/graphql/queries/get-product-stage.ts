import gql from 'graphql-tag'
import { ProductStage } from './get-product-stages'

export interface GetProductStageResult {
  productStage: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ProductStage | null
  }
}

export const GET_PRODUCT_STAGE = gql`
  query GetProductStage($id: ID!) {
    productStage(id: $id) {
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
