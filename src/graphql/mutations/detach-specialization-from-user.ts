import gql from 'graphql-tag'

export interface DetachSpecializationFromUserInput {
  userId: string
  specializationId: string
}

export interface DetachSpecializationFromUserResult {
  detachSpecializationFromUser: {
    successfully: boolean
    error: string | null
    message: string | null
    data: boolean | null
  }
}

export const DETACH_SPECIALIZATION_FROM_USER = gql`
  mutation DetachSpecializationFromUser($input: DetachSpecializationFromUserInput!) {
    detachSpecializationFromUser(input: $input) {
      successfully
      error
      message
      data
    }
  }
`
