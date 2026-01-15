import gql from 'graphql-tag'

export interface LoginInput {
  email: string
  password: string
}

export interface AuthPayload {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string | null
    telegramId: string | null
    avatarUrl: string | null
    description: string | null
    shortDescription: string | null
    country: string | null
    city: string | null
    phone: string | null
    role: {
      id: string
      name: string
      code: string
    }
  }
}

export interface LoginResult {
  login: {
    successfully: boolean
    data: AuthPayload | null
    error: string | null
    message: string | null
  }
}

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      successfully
      data
      error
      message
    }
  }
`
