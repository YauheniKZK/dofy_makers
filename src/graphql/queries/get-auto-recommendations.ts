import gql from 'graphql-tag'
import { Product } from './get-products'
import { Service } from './get-services'
import { Master } from './get-recommendation-collections'
import { RecommendationItemType } from './get-recommendation-collections'

export interface AutoRecommendationsData {
  products: Product[]
  services: Service[]
  masters: Master[]
  total: number
}

export interface GetAutoRecommendationsResult {
  autoRecommendations: {
    successfully: boolean
    error: string | null
    message: string | null
    data: AutoRecommendationsData | null
  }
}

export const GET_AUTO_RECOMMENDATIONS = gql`
  query GetAutoRecommendations(
    $itemType: RecommendationItemType
    $limit: Int
    $offset: Int
  ) {
    autoRecommendations(
      itemType: $itemType
      limit: $limit
      offset: $offset
    ) {
      successfully
      error
      message
      data {
        products {
          id
          name
          description
          price
          currency
          images
          isPublished
          favoritesCount
          createdAt
        }
        services {
          id
          name
          description
          price
          currency
          duration
          images
          isPublished
          favoritesCount
          createdAt
        }
        masters {
          id
          name
          firstName
          lastName
          avatarUrl
          city
          country
          shortDescription
          activated
          createdAt
        }
        total
      }
    }
  }
`
