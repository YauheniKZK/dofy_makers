import gql from 'graphql-tag'
import { MaterialGroup } from './get-material-groups'

export interface GetMaterialGroupResult {
  materialGroup: {
    successfully: boolean
    error: string | null
    message: string | null
    data: MaterialGroup | null
  }
}

export const GET_MATERIAL_GROUP = gql`
  query GetMaterialGroup($id: ID!) {
    materialGroup(id: $id) {
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
          slug
        }
      }
    }
  }
`
