import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface GetUserSpecializationsResult {
  userSpecializations: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Specialization[]
  }
}

export const GET_USER_SPECIALIZATIONS = gql`
  query GetUserSpecializations($userId: ID!) {
    userSpecializations(userId: $userId) {
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
