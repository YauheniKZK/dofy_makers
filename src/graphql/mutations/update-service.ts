import gql from 'graphql-tag'

export interface UpdateServiceInput {
  serviceId: string
  name?: string
  description?: string
  price?: number
  currency?: string
  duration?: number
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
  tagIds?: string[]
  materialIds?: string[]
}

export interface UpdatedService {
  id: string
  name: string
  price: number
  duration: number | null
  updatedAt: string
}

export interface UpdateServiceResult {
  updateService: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UpdatedService | null
  }
}

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        price
        duration
        updatedAt
      }
    }
  }
`
