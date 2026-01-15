import gql from 'graphql-tag'

export interface Material {
  id: string
  name: string
}

export interface ServiceWithMaterials {
  id: string
  name: string
  materials?: Material[]
}

export interface RemoveMaterialFromServiceInput {
  serviceId: string
  materialId: string
}

export interface RemoveMaterialFromServiceResult {
  removeMaterialFromService: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ServiceWithMaterials | null
  }
}

export const REMOVE_MATERIAL_FROM_SERVICE = gql`
  mutation RemoveMaterialFromService($input: RemoveMaterialFromServiceInput!) {
    removeMaterialFromService(input: $input) {
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
