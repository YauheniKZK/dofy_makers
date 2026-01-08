import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface GetSpecializationByIdResult {
  specialization: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Specialization | null
  }
}

export const GET_SPECIALIZATION_BY_ID = gql`
  query GetSpecializationById($id: ID!) {
    specialization(id: $id) {
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
