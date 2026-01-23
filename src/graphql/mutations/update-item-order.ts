import gql from 'graphql-tag'
import { RecommendationItem } from '../queries/get-recommendation-collections'

export interface UpdateItemOrderInput {
  itemId: string
  displayOrder: number
}

export interface UpdateItemOrderResult {
  updateItemOrder: {
    successfully: boolean
    error: string | null
    message: string | null
    data: RecommendationItem | null
  }
}

export const UPDATE_ITEM_ORDER = gql`
  mutation UpdateItemOrder($input: UpdateItemOrderInput!) {
    updateItemOrder(input: $input) {
      successfully
      error
      message
      data {
        id
        displayOrder
      }
    }
  }
`
