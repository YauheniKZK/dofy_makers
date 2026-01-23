import gql from 'graphql-tag'

export interface RemoveItemFromCollectionResult {
  removeItemFromCollection: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const REMOVE_ITEM_FROM_COLLECTION = gql`
  mutation RemoveItemFromCollection($itemId: ID!) {
    removeItemFromCollection(itemId: $itemId) {
      successfully
      error
      message
    }
  }
`
