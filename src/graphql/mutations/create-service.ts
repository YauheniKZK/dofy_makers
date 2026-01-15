import gql from 'graphql-tag'

export interface CreateServiceInput {
  subcategoryId: string
  name: string
  description?: string
  price: number
  currency: string
  duration?: number
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
  tagIds?: string[]
  materialIds?: string[]
}

export interface CreatedService {
  id: string
  name: string
  description: string | null
  price: number
  duration: number | null
  isActive: boolean
  isPublished: boolean
  createdAt: string
}

export interface CreateServiceResult {
  createService: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedService | null
  }
}

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        price
        duration
        isActive
        isPublished
        createdAt
      }
    }
  }
`
