import gql from 'graphql-tag'
import { RecommendationItem } from './get-recommendation-collections'

export interface GetRecommendationItemsResult {
  recommendationItems: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      items: RecommendationItem[]
      total: number
    }
  }
}

export const GET_RECOMMENDATION_ITEMS = gql`
  query GetRecommendationItems(
    $collectionId: ID!
    $limit: Int
    $offset: Int
  ) {
    recommendationItems(
      collectionId: $collectionId
      limit: $limit
      offset: $offset
    ) {
      successfully
      error
      message
      data {
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
        total
      }
    }
  }
`
