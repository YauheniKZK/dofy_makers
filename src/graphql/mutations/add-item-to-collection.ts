import gql from 'graphql-tag'
import { RecommendationItemType, RecommendationItem } from '../queries/get-recommendation-collections'

export interface AddItemToCollectionInput {
  collectionId: string
  itemType: RecommendationItemType
  itemId: string
  displayOrder?: number | null
  metadata?: any | null
}

export interface AddItemToCollectionResult {
  addItemToCollection: {
    successfully: boolean
    error: string | null
    message: string | null
    data: RecommendationItem | null
  }
}

export const ADD_ITEM_TO_COLLECTION = gql`
  mutation AddItemToCollection($input: AddItemToCollectionInput!) {
    addItemToCollection(input: $input) {
      successfully
      error
      message
      data {
        id
        itemType
        itemId
        displayOrder
        metadata
        product {
          id
          name
          price
          images
        }
        service {
          id
          name
          price
          duration
          images
        }
        master {
          id
          name
          avatarUrl
          city
        }
        createdAt
        updatedAt
      }
    }
  }
`
