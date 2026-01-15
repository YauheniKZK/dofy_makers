import gql from 'graphql-tag'

export interface DeleteProductResult {
  deleteProduct: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      successfully
      error
      message
    }
  }
`
