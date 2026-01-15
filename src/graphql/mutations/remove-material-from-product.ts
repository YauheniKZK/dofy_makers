import gql from 'graphql-tag'

export interface Material {
  id: string
  name: string
}

export interface ProductWithMaterials {
  id: string
  name: string
  materials?: Material[]
}

export interface RemoveMaterialFromProductInput {
  productId: string
  materialId: string
}

export interface RemoveMaterialFromProductResult {
  removeMaterialFromProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ProductWithMaterials | null
  }
}

export const REMOVE_MATERIAL_FROM_PRODUCT = gql`
  mutation RemoveMaterialFromProduct($input: RemoveMaterialFromProductInput!) {
    removeMaterialFromProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        materials {
          id
          name
        }
      }
    }
  }
`
