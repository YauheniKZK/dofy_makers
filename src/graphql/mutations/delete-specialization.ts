import gql from 'graphql-tag'

export interface DeleteSpecializationResult {
  deleteSpecialization: {
    successfully: boolean
    error: string | null
    message: string | null
    data: boolean | null
  }
}

export const DELETE_SPECIALIZATION = gql`
  mutation DeleteSpecialization($specializationId: ID!) {
    deleteSpecialization(specializationId: $specializationId) {
      successfully
      error
      message
      data
    }
  }
`
