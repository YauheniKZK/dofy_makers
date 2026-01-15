import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
}

export interface ProductWithTags {
  id: string
  name: string
  tags?: Tag[]
}

export interface RemoveTagFromProductInput {
  productId: string
  tagId: string
}

export interface RemoveTagFromProductResult {
  removeTagFromProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ProductWithTags | null
  }
}

export const REMOVE_TAG_FROM_PRODUCT = gql`
  mutation RemoveTagFromProduct($input: RemoveTagFromProductInput!) {
    removeTagFromProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        tags {
          id
          name
        }
      }
    }
  }
`
