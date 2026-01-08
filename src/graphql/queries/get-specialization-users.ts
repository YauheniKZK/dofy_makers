import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface SpecializationUser {
  id: string
  name: string
  email: string | null
  telegramId: string | null
  specializations: Pick<Specialization, 'id' | 'name' | 'type'>[]
}

export interface GetSpecializationUsersResult {
  specializationUsers: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      users: SpecializationUser[]
      total: number
    } | null
  }
}

export const GET_SPECIALIZATION_USERS = gql`
  query GetSpecializationUsers($specializationId: ID!) {
    specializationUsers(specializationId: $specializationId) {
      successfully
      error
      message
      data {
        users {
          id
          name
          email
          telegramId
          specializations {
            id
            name
            type
          }
        }
        total
      }
    }
  }
`
