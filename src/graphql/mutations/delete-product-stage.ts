import gql from 'graphql-tag'

export interface DeleteProductStageResult {
  deleteProductStage: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const DELETE_PRODUCT_STAGE = gql`
  mutation DeleteProductStage($stageId: ID!) {
    deleteProductStage(stageId: $stageId) {
      successfully
      error
      message
    }
  }
`
