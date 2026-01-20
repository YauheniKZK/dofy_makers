import gql from 'graphql-tag'

export type ProductType = 'PRODUCT' | 'BUNDLE'

export interface ProductBundleItemInput {
  productId: string
  quantity?: number
  order?: number
}

export interface UpdateProductInput {
  productId: string
  name?: string
  description?: string
  price?: number
  currency?: string
  productType?: ProductType
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
  tagIds?: string[]
  materialIds?: string[]
  bundleItems?: ProductBundleItemInput[]
}

export interface ProductBundleItem {
  product: {
    id: string
    name: string
  }
  quantity: number
  order: number
}

export interface UpdatedProduct {
  id: string
  name: string
  description: string | null
  price: number
  productType?: string
  bundleItems?: ProductBundleItem[]
  updatedAt: string
}

export interface UpdateProductResult {
  updateProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UpdatedProduct | null
  }
}

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        price
        productType
        bundleItems {
          product {
            id
            name
          }
          quantity
          order
        }
        updatedAt
      }
    }
  }
`
