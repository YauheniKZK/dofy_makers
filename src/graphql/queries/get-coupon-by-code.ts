import gql from 'graphql-tag'

export interface CouponUser {
  id: string
  name: string
}

export interface Coupon {
  id: string
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
  user?: CouponUser
}

export interface GetCouponByCodeResult {
  couponByCode: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Coupon | null
  }
}

export const GET_COUPON_BY_CODE = gql`
  query GetCouponByCode($code: String!) {
    couponByCode(code: $code) {
      successfully
      error
      message
      data {
        id
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
        user {
          id
          name
        }
      }
    }
  }
`
