import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface AttachSpecializationToUserInput {
  userId: string
  specializationId: string
}

export interface AttachSpecializationToUserResult {
  attachSpecializationToUser: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Specialization | null
  }
}

export const ATTACH_SPECIALIZATION_TO_USER = gql`
  mutation AttachSpecializationToUser($input: AttachSpecializationToUserInput!) {
    attachSpecializationToUser(input: $input) {
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
