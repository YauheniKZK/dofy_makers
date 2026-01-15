import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
}

export interface ServiceWithTags {
  id: string
  name: string
  tags?: Tag[]
}

export interface RemoveTagFromServiceInput {
  serviceId: string
  tagId: string
}

export interface RemoveTagFromServiceResult {
  removeTagFromService: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ServiceWithTags | null
  }
}

export const REMOVE_TAG_FROM_SERVICE = gql`
  mutation RemoveTagFromService($input: RemoveTagFromServiceInput!) {
    removeTagFromService(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        tags {
          id
          name
        }
      }
    }
  }
`
