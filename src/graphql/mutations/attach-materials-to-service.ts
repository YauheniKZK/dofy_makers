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

export interface ServiceWithMaterials {
  id: string
  name: string
  materials?: Material[]
}

export interface AttachMaterialsToServiceInput {
  serviceId: string
  materialIds: string[]
}

export interface AttachMaterialsToServiceResult {
  attachMaterialsToService: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ServiceWithMaterials | null
  }
}

export const ATTACH_MATERIALS_TO_SERVICE = gql`
  mutation AttachMaterialsToService($input: AttachMaterialsToServiceInput!) {
    attachMaterialsToService(input: $input) {
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
