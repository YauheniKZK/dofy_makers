import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface UpdateSpecializationInput {
  specializationId: string
  name?: string
  description?: string | null
  type?: 'system' | 'patient'
}

export interface UpdateSpecializationResult {
  updateSpecialization: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Specialization | null
  }
}

export const UPDATE_SPECIALIZATION = gql`
  mutation UpdateSpecialization($input: UpdateSpecializationInput!) {
    updateSpecialization(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        description
        type
        createdAt
        updatedAt
      }
    }
  }
`
