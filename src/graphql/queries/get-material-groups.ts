import gql from 'graphql-tag'

export interface Material {
  id: string
  name: string
  description: string | null
}

export interface MaterialGroup {
  id: string
  name: string
  description: string | null
  slug: string
  sortOrder: number
  isActive: boolean
  materials?: Material[]
  createdAt: string
  updatedAt: string
}

export interface GetMaterialGroupsResult {
  materialGroups: {
    successfully: boolean
    error: string | null
    message: string | null
    data: MaterialGroup[]
  }
}

export const GET_MATERIAL_GROUPS = gql`
  query GetMaterialGroups($includeInactive: Boolean) {
    materialGroups(includeInactive: $includeInactive) {
      successfully
      error
      message
      data {
        id
        name
        description
        slug
        sortOrder
        isActive
        materials {
          id
          name
          description
        }
        createdAt
        updatedAt
      }
    }
  }
`
