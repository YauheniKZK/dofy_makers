import gql from 'graphql-tag'

export interface MaterialGroup {
  id: string
  name: string
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

export interface GetMaterialsResult {
  materials: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Material[]
  }
}

export const GET_MATERIALS = gql`
  query GetMaterials($materialGroupId: ID, $includeInactive: Boolean) {
    materials(materialGroupId: $materialGroupId, includeInactive: $includeInactive) {
      successfully
      error
      message
      data {
        id
        materialGroupId
        materialGroup {
          id
          name
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
