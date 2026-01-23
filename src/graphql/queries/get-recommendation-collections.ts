import gql from 'graphql-tag'
import { Product } from './get-products'
import { Service } from './get-services'

export enum RecommendationCollectionType {
  PRODUCTS = 'PRODUCTS',
  SERVICES = 'SERVICES',
  MASTERS = 'MASTERS',
  MIXED = 'MIXED'
}

export enum RecommendationItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  MASTER = 'MASTER'
}

export interface Master {
  id: string
  name: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  city: string | null
  country: string | null
  description: string | null
  shortDescription: string | null
  activated?: boolean | null
  specializations?: Array<{
    id: string
    name: string
  }>
}

export interface RecommendationItem {
  id: string
  itemType: RecommendationItemType
  itemId: string
  displayOrder: number
  metadata: any
  product?: Product | null
  service?: Service | null
  master?: Master | null
  createdAt: string
  updatedAt: string
}

export interface RecommendationCollection {
  id: string
  name: string
  description: string | null
  collectionType: RecommendationCollectionType
  displayOrder: number
  isActive: boolean
  metadata: any
  items: RecommendationItem[]
  createdAt: string
  updatedAt: string
}

export interface GetRecommendationCollectionsResult {
  recommendationCollections: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      collections: RecommendationCollection[]
      total: number
    }
  }
}

export const GET_RECOMMENDATION_COLLECTIONS = gql`
  query GetRecommendationCollections(
    $collectionType: RecommendationCollectionType
    $isActive: Boolean
    $limit: Int
    $offset: Int
  ) {
    recommendationCollections(
      collectionType: $collectionType
      isActive: $isActive
      limit: $limit
      offset: $offset
    ) {
      successfully
      error
      message
      data {
        collections {
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
        total
      }
    }
  }
`
