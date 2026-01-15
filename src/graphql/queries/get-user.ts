import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface UserData {
  id: string
  name: string
  firstName: string | null
  lastName: string | null
  description: string | null
  shortDescription: string | null
  country: string | null
  city: string | null
  phone: string | null
  role: {
    code: string
    name: string
  }
  specializations?: Specialization[]
  createdAt: string
}

export interface GetUserResult {
  user: {
    successfully: boolean
    error: string | null
    message: string | null
    data: UserData | null
  }
}

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      successfully
      error
      message
      data {
        id
        name
        firstName
        lastName
        description
        shortDescription
        country
        city
        phone
        role {
          code
          name
        }
        specializations {
          id
          name
          type
        }
        createdAt
      }
    }
  }
`
