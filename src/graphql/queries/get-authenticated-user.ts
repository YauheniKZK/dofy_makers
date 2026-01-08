import gql from 'graphql-tag'
import { Specialization } from '../interface'

export interface BlockReason {
  id: string
  name: string
  description: string | null
  isActive: boolean
}

export interface User {
  id: string
  name: string
  email: string | null
  telegramId: string | null
  activated: boolean
  description: string | null
  shortDescription: string | null
  country: string | null
  city: string | null
  phone: string | null
  role: {
    id: string
    name: string
    code: string
    description: string | null
  }
  blockReasons: BlockReason[]
  specializations?: Specialization[]
  createdAt: string
  updatedAt: string
}

export interface GetAuthenticatedUserResult {
  me: {
    successfully: boolean
    data: User | null
    error: string | null
    message: string | null
  }
}

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      successfully
      message
      data {
        id
        name
        email
        telegramId
        activated
        description
        shortDescription
        country
        city
        phone
        role {
          id
          name
          code
        }
        blockReasons {
          id
          name
          description
          isActive
        }
        specializations {
          id
          name
          description
          type
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      error
    }
  }
`
