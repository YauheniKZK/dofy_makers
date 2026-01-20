import gql from 'graphql-tag'

export interface GetFavoriteCountResult {
  favoriteCount: {
    successfully: boolean
    error: string | null
    message: string | null
    data: number
  }
}

export const GET_FAVORITE_COUNT = gql`
  query GetFavoriteCount($favoriteableType: FavoriteableType!, $favoriteableId: ID!) {
    favoriteCount(favoriteableType: $favoriteableType, favoriteableId: $favoriteableId) {
      successfully
      error
      message
      data
    }
  }
`
