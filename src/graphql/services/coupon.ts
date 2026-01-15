import client from '../index'
import { GET_COUPONS, type GetCouponsResult } from '../queries/get-coupons'
import { GET_COUPON, type GetCouponResult } from '../queries/get-coupon'
import { GET_COUPON_BY_CODE, type GetCouponByCodeResult } from '../queries/get-coupon-by-code'

/**
 * Получить список купонов
 */
export const getCoupons = async (params?: { userId?: string; limit?: number; offset?: number }) => {
  return await client.query<GetCouponsResult>({
    query: GET_COUPONS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить купон по ID
 */
export const getCoupon = async (id: string) => {
  return await client.query<GetCouponResult>({
    query: GET_COUPON,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить купон по коду
 */
export const getCouponByCode = async (code: string) => {
  return await client.query<GetCouponByCodeResult>({
    query: GET_COUPON_BY_CODE,
    variables: { code },
    fetchPolicy: 'no-cache'
  })
}
