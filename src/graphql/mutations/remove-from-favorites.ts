import gql from 'graphql-tag'

export interface RemoveFromFavoritesResult {
  removeFromFavorites: {
    successfully: boolean
    error: string | null
    message: string | null
  }
}

export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($favoriteableType: FavoriteableType!, $favoriteableId: ID!) {
    removeFromFavorites(favoriteableType: $favoriteableType, favoriteableId: $favoriteableId) {
      successfully
      error
      message
    }
  }
`
