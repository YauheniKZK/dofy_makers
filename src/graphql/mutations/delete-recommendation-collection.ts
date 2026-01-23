import gql from 'graphql-tag'

export interface DeleteRecommendationCollectionResult {
  deleteRecommendationCollection: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const DELETE_RECOMMENDATION_COLLECTION = gql`
  mutation DeleteRecommendationCollection($collectionId: ID!) {
    deleteRecommendationCollection(collectionId: $collectionId) {
      successfully
      error
      message
    }
  }
`
