import gql from 'graphql-tag'
import { RecommendationCollection } from '../queries/get-recommendation-collections'

export interface ReorderCollectionItemsInput {
  collectionId: string
  itemIds: string[]
}

export interface ReorderCollectionItemsResult {
  reorderCollectionItems: {
    successfully: boolean
    error: string | null
    message: string | null
    data: RecommendationCollection | null
  }
}

export const REORDER_COLLECTION_ITEMS = gql`
  mutation ReorderCollectionItems($input: ReorderCollectionItemsInput!) {
    reorderCollectionItems(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        items {
          id
          displayOrder
          product {
            id
            name
          }
          service {
            id
            name
          }
          master {
            id
            name
          }
        }
      }
    }
  }
`
