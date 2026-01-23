import gql from 'graphql-tag'
import { RecommendationCollectionType, RecommendationCollection } from '../queries/get-recommendation-collections'

export interface UpdateRecommendationCollectionInput {
  collectionId: string
  name?: string | null
  description?: string | null
  collectionType?: RecommendationCollectionType | null
  displayOrder?: number | null
  isActive?: boolean | null
  metadata?: any | null
}

export interface UpdateRecommendationCollectionResult {
  updateRecommendationCollection: {
    successfully: boolean
    error: string | null
    message: string | null
    data: RecommendationCollection | null
  }
}

export const UPDATE_RECOMMENDATION_COLLECTION = gql`
  mutation UpdateRecommendationCollection($input: UpdateRecommendationCollectionInput!) {
    updateRecommendationCollection(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        collectionType
        displayOrder
        isActive
        metadata
        updatedAt
      }
    }
  }
`
