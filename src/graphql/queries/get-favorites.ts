import gql from 'graphql-tag'

export interface FavoriteUser {
  id: string
  name: string
  email: string
}

export interface Favorite {
  id: string
  userId: string
  user?: FavoriteUser
  favoriteableType: string
  favoriteableId: string
  createdAt: string
}

export interface GetFavoritesResult {
  favorites: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      favorites: Favorite[]
      total: number
    }
  }
}

export const GET_FAVORITES = gql`
  query GetFavorites($favoriteableType: FavoriteableType!, $favoriteableId: ID!, $limit: Int, $offset: Int) {
    favorites(favoriteableType: $favoriteableType, favoriteableId: $favoriteableId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        favorites {
          id
          userId
          user {
            id
            name
            email
          }
          favoriteableType
          favoriteableId
          createdAt
        }
        total
      }
    }
  }
`
