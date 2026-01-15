import gql from 'graphql-tag'

export interface UpdateUserInput {
  userId: string
  name?: string
  firstName?: string
  lastName?: string
  description?: string
  shortDescription?: string
  country?: string
  city?: string
  phone?: string
}

export interface UpdateUserResult {
  updateUser: {
    successfully: boolean
    error: string | null
    message: string | null
    data: any
  }
}

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      successfully
      error
      message
      data
    }
  }
`
