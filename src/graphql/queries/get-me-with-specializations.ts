import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface UserWithSpecializations {
  id: string
  name: string
  email: string | null
  specializations: Specialization[]
}

export interface GetMeWithSpecializationsResult {
  me: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UserWithSpecializations | null
  }
}

export const GET_ME_WITH_SPECIALIZATIONS = gql`
  query GetMeWithSpecializations {
    me {
      successfully
      error
      message
      data {
        id
        name
        email
        specializations {
          id
          name
          description
          type
          createdAt
          updatedAt
        }
      }
    }
  }
`

export interface GetUserWithSpecializationsResult {
  user: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UserWithSpecializations | null
  }
}

export const GET_USER_WITH_SPECIALIZATIONS = gql`
  query GetUserWithSpecializations($userId: ID!) {
    user(id: $userId) {
      successfully
      error
      message
      data {
        id
        name
        email
        specializations {
          id
          name
          description
          type
          createdAt
          updatedAt
        }
      }
    }
  }
`
