import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getCoupons,
  getCoupon,
  getCouponByCode
} from '@/graphql/services/coupon'
import type { Coupon } from '@/graphql/queries/get-coupons'
import type { Coupon as CouponFromGetCouponByCode } from '@/graphql/queries/get-coupon-by-code'

// Универсальный интерфейс для состояния запроса
interface ApiState<T = any> {
  data: T | null
  loading: boolean
  success: boolean
  error: boolean
  message: string
}

// Универсальная функция для создания дефолтного состояния
const createDefaultApiState = <T = any>(): ApiState<T> => ({
  data: null,
  loading: false,
  success: false,
  error: false,
  message: ''
})

// Универсальная функция для сброса состояния
const resetApiState = <T = any>(state: ApiState<T>): void => {
  state.data = null
  state.loading = false
  state.success = false
  state.error = false
  state.message = ''
}

export const useCouponStore = defineStore('coupon', () => {
  // -----------------STATE---------------------
  const coupons = ref<Coupon[]>([])
  const currentCoupon = ref<Coupon | CouponFromGetCouponByCode | null>(null)

  // Состояния для каждого API запроса
  const getCouponsApiData = ref<ApiState<{ coupons: Coupon[]; total: number }>>(createDefaultApiState<{ coupons: Coupon[]; total: number }>())
  const getCouponApiData = ref<ApiState<Coupon>>(createDefaultApiState<Coupon>())
  const getCouponByCodeApiData = ref<ApiState<Coupon | CouponFromGetCouponByCode>>(createDefaultApiState<Coupon | CouponFromGetCouponByCode>())

  // -----------------GETTERS---------------------
  const couponsGetters = computed(() => coupons.value)
  const currentCouponGetters = computed(() => currentCoupon.value)

  // Геттеры для API состояний
  const getCouponsApiDataGetters = computed(() => getCouponsApiData.value)
  const getCouponApiDataGetters = computed(() => getCouponApiData.value)
  const getCouponByCodeApiDataGetters = computed(() => getCouponByCodeApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список купонов
  const fetchCoupons = async (params?: { userId?: string; limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getCouponsApiData.value)
    getCouponsApiData.value.loading = true

    try {
      const response = await getCoupons(params)

      if (response.data?.coupons?.successfully && response.data.coupons.data) {
        const data = response.data.coupons.data
        coupons.value = data.coupons
        getCouponsApiData.value.data = data
        getCouponsApiData.value.success = true
        getCouponsApiData.value.message = response.data.coupons.message || 'Купоны загружены'
      } else {
        const errorMsg = response.data?.coupons?.error || response.data?.coupons?.message || 'Ошибка загрузки купонов'
        getCouponsApiData.value.error = true
        getCouponsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки купонов'
      getCouponsApiData.value.error = true
      getCouponsApiData.value.message = errorMessage
    } finally {
      getCouponsApiData.value.loading = false
    }
  }

  // Получить купон по ID
  const fetchCoupon = async (id: string): Promise<Coupon | null> => {
    resetApiState(getCouponApiData.value)
    getCouponApiData.value.loading = true

    try {
      const response = await getCoupon(id)

      if (response.data?.coupon?.successfully && response.data.coupon.data) {
        const coupon = response.data.coupon.data
        currentCoupon.value = coupon
        getCouponApiData.value.data = coupon
        getCouponApiData.value.success = true
        getCouponApiData.value.message = response.data.coupon.message || 'Купон загружен'
        return coupon
      } else {
        const errorMsg = response.data?.coupon?.error || response.data?.coupon?.message || 'Купон не найден'
        getCouponApiData.value.error = true
        getCouponApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки купона'
      getCouponApiData.value.error = true
      getCouponApiData.value.message = errorMessage
      return null
    } finally {
      getCouponApiData.value.loading = false
    }
  }

  // Получить купон по коду
  const fetchCouponByCode = async (code: string): Promise<Coupon | CouponFromGetCouponByCode | null> => {
    resetApiState(getCouponByCodeApiData.value)
    getCouponByCodeApiData.value.loading = true

    try {
      const response = await getCouponByCode(code)

      if (response.data?.couponByCode?.successfully && response.data.couponByCode.data) {
        const coupon = response.data.couponByCode.data
        currentCoupon.value = coupon as Coupon
        getCouponByCodeApiData.value.data = coupon
        getCouponByCodeApiData.value.success = true
        getCouponByCodeApiData.value.message = response.data.couponByCode.message || 'Купон найден'
        return coupon
      } else {
        const errorMsg = response.data?.couponByCode?.error || response.data?.couponByCode?.message || 'Купон не найден'
        getCouponByCodeApiData.value.error = true
        getCouponByCodeApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка поиска купона'
      getCouponByCodeApiData.value.error = true
      getCouponByCodeApiData.value.message = errorMessage
      return null
    } finally {
      getCouponByCodeApiData.value.loading = false
    }
  }

  return {
    // State
    coupons,
    currentCoupon,
    
    // API States
    getCouponsApiData,
    getCouponApiData,
    getCouponByCodeApiData,
    
    // Getters
    couponsGetters,
    currentCouponGetters,
    
    // API Data Getters
    getCouponsApiDataGetters,
    getCouponApiDataGetters,
    getCouponByCodeApiDataGetters,
    
    // Actions
    fetchCoupons,
    fetchCoupon,
    fetchCouponByCode
  }
})
