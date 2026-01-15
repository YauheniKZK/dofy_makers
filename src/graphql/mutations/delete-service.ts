import gql from 'graphql-tag'

export interface DeleteServiceResult {
  deleteService: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const DELETE_SERVICE = gql`
  mutation DeleteService($serviceId: ID!) {
    deleteService(serviceId: $serviceId) {
      successfully
      error
      message
    }
  }
`
