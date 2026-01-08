import gql from 'graphql-tag'
import { Specialization } from '../interface'

// Реэкспорт для удобства
export type { Specialization }

export interface GetAllSpecializationsResult {
  specializations: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Specialization[]
  }
}

export const GET_ALL_SPECIALIZATIONS = gql`
  query GetAllSpecializations {
    specializations {
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

export const GET_SYSTEM_SPECIALIZATIONS = gql`
  query GetSystemSpecializations {
    specializations(type: system) {
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

export const GET_PATIENT_SPECIALIZATIONS = gql`
  query GetPatientSpecializations {
    specializations(type: patient) {
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
