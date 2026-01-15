import gql from 'graphql-tag'

export interface CouponUser {
  id: string
  name: string
}

export interface Coupon {
  id: string
  userId: string
  user?: CouponUser
  code: string
  type: string
  value: number
  currency: string
  description: string | null
  validFrom: string
  validUntil: string
  usageCount: number
  maxUsage: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetCouponsResult {
  coupons: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      coupons: Coupon[]
      total: number
    }
  }
}

export const GET_COUPONS = gql`
  query GetCoupons($userId: ID, $limit: Int, $offset: Int) {
    coupons(userId: $userId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        coupons {
          id
          userId
          user {
            id
            name
          }
          code
          type
          value
          currency
          description
          validFrom
          validUntil
          usageCount
          maxUsage
          isActive
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
