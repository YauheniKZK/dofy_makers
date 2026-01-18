import gql from 'graphql-tag'
import { UserStatus } from '../interface'

export interface UpdateUserStatusInput {
  userId: string
  status: UserStatus
}

export interface UpdateUserStatusResult {
  updateUserStatus: {
    successfully: boolean
    error: string | null
    message: string | null
    data: any
  }
}

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($input: UpdateUserStatusInput!) {
    updateUserStatus(input: $input) {
      successfully
      error
      message
      data
    }
  }
`
