import gql from 'graphql-tag'

export interface IsFavoriteResult {
  isFavorite: {
    successfully: boolean
    error: string | null
    message: string | null
    data: boolean
  }
}

export const IS_FAVORITE = gql`
  query IsFavorite($userId: ID, $favoriteableType: FavoriteableType!, $favoriteableId: ID!) {
    isFavorite(userId: $userId, favoriteableType: $favoriteableType, favoriteableId: $favoriteableId) {
      successfully
      error
      message
      data
    }
  }
`
