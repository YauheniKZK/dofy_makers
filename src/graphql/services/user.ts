import { Config } from "@/config"
import client from '../index'
import { GET_CURRENT_USER, type GetAuthenticatedUserResult } from '../queries/get-authenticated-user'
import { GET_USER_BY_TELEGRAM_ID, type GetUserByTelegramIdResult } from '../queries/get-user-by-telegram-id'
import { GET_USER, type GetUserResult } from '../queries/get-user'
import { LOGIN, type LoginInput, type LoginResult } from '../mutations/create-tokens-user'
import { REFRESH_TOKEN, type RefreshTokenResult } from '../mutations/refresh-token'
import { ACTIVATE_USER, type ActivateUserResult } from '../mutations/activate-user'
import { REGISTER_USER, type RegisterUserByTelegramInput, type RegisterUserResult } from '../mutations/create-user'
import { UPDATE_USER, type UpdateUserInput, type UpdateUserResult } from '../mutations/update-user'
import { SEND_TO_CHANNEL, type SendToChannelInput, type SendToChannelResult } from '../mutations/send-to-channel'
import { LOGIN_BY_TELEGRAM_ID, type LoginByTelegramIdResult } from '../mutations/login-by-telegram-id'
import { LOGOUT, type LogoutResult } from '../mutations/logout'

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

const activateUser = async (telegramId: string) => {
  return await client.mutate<ActivateUserResult>({
    mutation: ACTIVATE_USER,
    variables: {
      telegramId
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

const sendToChannel = async (input: SendToChannelInput) => {
  return await client.mutate<SendToChannelResult>({
    mutation: SEND_TO_CHANNEL,
    variables: {
      input
    }
  })
}

const loginByTelegramId = async (telegramId: string, photoUrl?: string) => {
  return await client.mutate<LoginByTelegramIdResult>({
    mutation: LOGIN_BY_TELEGRAM_ID,
    variables: {
      telegramId,
      ...(photoUrl && { photoUrl })
    }
  })
}

const getUser = async (id: string) => {
  return await client.query<GetUserResult>({
    query: GET_USER,
    variables: {
      id
    },
    fetchPolicy: 'no-cache'
  })
}

const updateUser = async (input: UpdateUserInput) => {
  return await client.mutate<UpdateUserResult>({
    mutation: UPDATE_USER,
    variables: {
      input
    }
  })
}

const logout = async (token: string) => {
  return await client.mutate<LogoutResult>({
    mutation: LOGOUT,
    variables: {
      token
    }
  })
}

export {
  login,
  refreshToken,
  getCurrentUser,
  getUserByTelegramId,
  getUser,
  activateUser,
  registerUserByTelegram,
  updateUser,
  sendToChannel,
  loginByTelegramId,
  logout
}