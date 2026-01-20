import gql from 'graphql-tag'

export interface Favorite {
  id: string
  userId: string
  favoriteableType: string
  favoriteableId: string
  createdAt: string
}

export interface AddToFavoritesInput {
  favoriteableType: string
  favoriteableId: string
}

export interface AddToFavoritesResult {
  addToFavorites: {
    successfully: boolean
    error: string | null
    message: string | null
    data: Favorite | null
  }
}

export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($input: AddToFavoritesInput!) {
    addToFavorites(input: $input) {
      successfully
      error
      message
      data {
        id
        userId
        favoriteableType
        favoriteableId
        createdAt
      }
    }
  }
`
