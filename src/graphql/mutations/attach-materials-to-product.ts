import gql from 'graphql-tag'

export interface MaterialGroup {
  id: string
  name: string
}

export interface Material {
  id: string
  name: string
  materialGroup?: MaterialGroup
}

export interface ProductWithMaterials {
  id: string
  name: string
  materials?: Material[]
}

export interface AttachMaterialsToProductInput {
  productId: string
  materialIds: string[]
}

export interface AttachMaterialsToProductResult {
  attachMaterialsToProduct: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ProductWithMaterials | null
  }
}

export const ATTACH_MATERIALS_TO_PRODUCT = gql`
  mutation AttachMaterialsToProduct($input: AttachMaterialsToProductInput!) {
    attachMaterialsToProduct(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        materials {
          id
          name
          materialGroup {
            id
            name
          }
        }
      }
    }
  }
`
