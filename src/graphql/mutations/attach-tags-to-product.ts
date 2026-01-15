import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
}

export interface ProductWithTags {
  id: string
  name: string
  tags?: Tag[]
}

export interface AttachTagsToProductInput {
  productId: string
  tagIds: string[]
}

export interface AttachTagsToProductResult {
  attachTagsToProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ProductWithTags | null
  }
}

export const ATTACH_TAGS_TO_PRODUCT = gql`
  mutation AttachTagsToProduct($input: AttachTagsToProductInput!) {
    attachTagsToProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        tags {
          id
          name
          type
        }
      }
    }
  }
`
