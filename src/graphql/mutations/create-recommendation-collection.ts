import gql from 'graphql-tag'
import { RecommendationCollectionType, RecommendationCollection } from '../queries/get-recommendation-collections'

export interface CreateRecommendationCollectionInput {
  name: string
  description?: string | null
  collectionType: RecommendationCollectionType
  displayOrder?: number | null
  isActive?: boolean | null
  metadata?: any | null
}

export interface CreateRecommendationCollectionResult {
  createRecommendationCollection: {
    successfully: boolean
    error: string | null
    message: string | null
    data: RecommendationCollection | null
  }
}

export const CREATE_RECOMMENDATION_COLLECTION = gql`
  mutation CreateRecommendationCollection($input: CreateRecommendationCollectionInput!) {
    createRecommendationCollection(input: $input) {
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
        createdAt
        updatedAt
      }
    }
  }
`
