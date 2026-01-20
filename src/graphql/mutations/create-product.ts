import gql from 'graphql-tag'

export type ProductType = 'PRODUCT' | 'BUNDLE'

export interface CreateProductForBundleInput {
  subcategoryId?: string
  name: string
  description?: string
  price?: number
  currency?: string
  images?: string[]
  isActive?: boolean
  isPublished?: boolean
  allowCoupons?: boolean
  tagIds?: string[]
  materialIds?: string[]
}

export interface ProductBundleItemInput {
  productId?: string
  newProduct?: CreateProductForBundleInput
  quantity?: number
  order?: number
}

export interface CreateProductInput {
  subcategoryId: string
  name: string
  description?: string
  price: number
  currency: string
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
    price: number
    images: string[]
  }
  quantity: number
  order: number
}

export interface CreatedProduct {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  productType?: string
  images: string[]
  isActive: boolean
  isPublished: boolean
  bundleItems?: ProductBundleItem[]
  createdAt: string
}

export interface CreateProductResult {
  createProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedProduct | null
  }
}

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        price
        currency
        productType
        images
        isActive
        isPublished
        bundleItems {
          product {
            id
            name
            price
            images
          }
          quantity
          order
        }
        createdAt
      }
    }
  }
`
