import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface CreateSpecializationInput {
  name: string
  description?: string | null
  type?: 'system' | 'patient'
}

export interface CreateSpecializationResult {
  createSpecialization: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Specialization | null
  }
}

export const CREATE_SPECIALIZATION = gql`
  mutation CreateSpecialization($input: CreateSpecializationInput!) {
    createSpecialization(input: $input) {
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
