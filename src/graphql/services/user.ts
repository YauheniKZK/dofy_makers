import { Config } from "@/config"
import client from '../index'
import { GET_CURRENT_USER, type GetAuthenticatedUserResult } from '../queries/get-authenticated-user'
import { GET_USER_BY_TELEGRAM_ID, type GetUserByTelegramIdResult } from '../queries/get-user-by-telegram-id'
import { LOGIN, type LoginInput, type LoginResult } from '../mutations/create-tokens-user'
import { REFRESH_TOKEN, type RefreshTokenResult } from '../mutations/refresh-token'
import { ACTIVATE_USER, type ActivateUserResult } from '../mutations/activate-user'
import { REGISTER_USER, type RegisterUserByTelegramInput, type RegisterUserResult } from '../mutations/create-user'

const login = async (
  input: LoginInput
) => {
  return await client.mutate<LoginResult>({
    mutation: LOGIN,
    variables: {
      input
    }
  })
}

const refreshToken = async (
  token: string
) => {
  return await client.mutate<RefreshTokenResult>({
    mutation: REFRESH_TOKEN,
    variables: {
      token
    }
  })
}

const getCurrentUser = async () => {
  return await client.query<GetAuthenticatedUserResult>({
    query: GET_CURRENT_USER,
    fetchPolicy: 'no-cache'
  })
}

const getUserByTelegramId = async (telegramId: string) => {
  return await client.query<GetUserByTelegramIdResult>({
    query: GET_USER_BY_TELEGRAM_ID,
    variables: {
      telegramId
    },
    fetchPolicy: 'no-cache'
  })
}

const activateUser = async (userId: string) => {
  return await client.mutate<ActivateUserResult>({
    mutation: ACTIVATE_USER,
    variables: {
      userId
    }
  })
}

const registerUserByTelegram = async (input: RegisterUserByTelegramInput) => {
  return await client.mutate<RegisterUserResult>({
    mutation: REGISTER_USER,
    variables: {
      input
    }
  })
}

export {
  login,
  refreshToken,
  getCurrentUser,
  getUserByTelegramId,
  activateUser,
  registerUserByTelegram
}