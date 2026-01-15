import gql from 'graphql-tag'

export interface UpdateProductStageInput {
  stageId: string
  name?: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  order?: number
}

export interface UpdatedProductStage {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
  updatedAt: string
}

export interface UpdateProductStageResult {
  updateProductStage: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UpdatedProductStage | null
  }
}

export const UPDATE_PRODUCT_STAGE = gql`
  mutation UpdateProductStage($input: UpdateProductStageInput!) {
    updateProductStage(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        imageUrl
        videoUrl
        order
        updatedAt
      }
    }
  }
`
