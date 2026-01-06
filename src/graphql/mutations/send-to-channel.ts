import gql from 'graphql-tag'

export interface SendToChannelInput {
  message: string
  channelId?: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  telegramId?: string
  userId?: string
}

export interface SendToChannelData {
  channel: string
  messageLength: number
  userId: string | null
  telegramId: string | null
}

export interface SendToChannelResult {
  sendToChannel: {
    successfully: boolean
    message: string | null
    error: string | null
    data: SendToChannelData | null
  }
}

export const SEND_TO_CHANNEL = gql`
  mutation SendToChannel($input: SendToChannelInput!) {
    sendToChannel(input: $input) {
      successfully
      message
      error
      data {
        channel
        messageLength
        userId
        telegramId
      }
    }
  }
`

