import gql from 'graphql-tag'
import { RecommendationCollection, GetRecommendationCollectionsResult } from './get-recommendation-collections'

export interface GetRecommendationCollectionResult {
  recommendationCollection: {
    successfully: boolean
    error: string | null
    message: string | null
    data: RecommendationCollection | null
  }
}

export const GET_RECOMMENDATION_COLLECTION = gql`
  query GetRecommendationCollection($id: ID!) {
    recommendationCollection(id: $id) {
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
        items {
          id
          itemType
          itemId
          displayOrder
          metadata
          product {
            id
            name
            description
            price
            currency
            images
            isPublished
          }
          service {
            id
            name
            description
            price
            currency
            duration
            images
            isPublished
          }
          master {
            id
            name
            firstName
            lastName
            avatarUrl
            city
            country
            description
            shortDescription
            specializations {
              id
              name
            }
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`
