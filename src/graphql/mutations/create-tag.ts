import gql from 'graphql-tag'

export interface CreateTagInput {
  name: string
  type: string
  description?: string
  slug?: string
  isActive?: boolean
  synonyms?: string[]
}

export interface CreatedTag {
  id: string
  name: string
  type: string
  description: string | null
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTagResult {
  createTag: {
    successfully: boolean
    error: string | null
    message: string | null
    data: CreatedTag | null
  }
}

export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        type
        description
        slug
        isActive
        createdAt
        updatedAt
      }
    }
  }
`
