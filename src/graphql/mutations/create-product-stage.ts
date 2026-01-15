import gql from 'graphql-tag'

export interface CreateProductStageInput {
  productId: string
  name: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  order: number
}

export interface CreatedProductStage {
  id: string
  productId: string
  name: string
  description: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
  createdAt: string
}

export interface CreateProductStageResult {
  createProductStage: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedProductStage | null
  }
}

export const CREATE_PRODUCT_STAGE = gql`
  mutation CreateProductStage($input: CreateProductStageInput!) {
    createProductStage(input: $input) {
      successfully
      error
      message
      data {
        id
        productId
        name
        description
        imageUrl
        videoUrl
        order
        createdAt
      }
    }
  }
`
