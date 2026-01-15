import gql from 'graphql-tag'

export interface CouponUser {
  id: string
  name: string
  email: string | null
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

export interface GetCouponResult {
  coupon: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Coupon | null
  }
}

export const GET_COUPON = gql`
  query GetCoupon($id: ID!) {
    coupon(id: $id) {
      successfully
      error
      message
      data {
        id
        userId
        user {
          id
          name
          email
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
    }
  }
`
