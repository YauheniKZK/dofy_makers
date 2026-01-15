import gql from 'graphql-tag'

export interface MaterialGroup {
  id: string
  name: string
  description: string | null
}

export interface Material {
  id: string
  materialGroupId: string
  materialGroup?: MaterialGroup
  name: string
  description: string | null
  slug: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetMaterialResult {
  material: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Material | null
  }
}

export const GET_MATERIAL = gql`
  query GetMaterial($id: ID!) {
    material(id: $id) {
      successfully
      error
      message
      data {
        id
        materialGroupId
        materialGroup {
          id
          name
          description
        }
        name
        description
        slug
        sortOrder
        isActive
        createdAt
        updatedAt
      }
    }
  }
`
