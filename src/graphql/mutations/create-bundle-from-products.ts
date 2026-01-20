import gql from 'graphql-tag'

export interface CreateBundleFromProductsInput {
  name: string
  description?: string
  subcategoryId?: string
  productIds: string[]
  quantities?: number[]
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
}

export interface ProductBundleItem {
  product: {
    id: string
    name: string
    price: number
  }
  quantity: number
  order: number
}

export interface CreatedBundle {
  id: string
  name: string
  description: string | null
  productType: string
  bundleItems: ProductBundleItem[]
  createdAt: string
}

export interface CreateBundleFromProductsResult {
  createBundleFromProducts: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedBundle | null
  }
}

export const CREATE_BUNDLE_FROM_PRODUCTS = gql`
  mutation CreateBundleFromProducts($input: CreateBundleFromProductsInput!) {
    createBundleFromProducts(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        productType
        bundleItems {
          product {
            id
            name
            price
          }
          quantity
          order
        }
        createdAt
      }
    }
  }
`
