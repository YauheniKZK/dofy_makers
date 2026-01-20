import gql from 'graphql-tag'

export interface UserFavorite {
  id: string
  favoriteableType: string
  favoriteableId: string
  createdAt: string
}

export interface GetUserFavoritesResult {
  userFavorites: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      favorites: UserFavorite[]
      total: number
    }
  }
}

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: ID, $favoriteableType: FavoriteableType, $limit: Int, $offset: Int) {
    userFavorites(userId: $userId, favoriteableType: $favoriteableType, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        favorites {
          id
          favoriteableType
          favoriteableId
          createdAt
        }
        total
      }
    }
  }
`
