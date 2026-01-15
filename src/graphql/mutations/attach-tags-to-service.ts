import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
}

export interface ServiceWithTags {
  id: string
  name: string
  tags?: Tag[]
}

export interface AttachTagsToServiceInput {
  serviceId: string
  tagIds: string[]
}

export interface AttachTagsToServiceResult {
  attachTagsToService: {
    successfully: boolean
    error: string | null
    message: string | null
    data: ServiceWithTags | null
  }
}

export const ATTACH_TAGS_TO_SERVICE = gql`
  mutation AttachTagsToService($input: AttachTagsToServiceInput!) {
    attachTagsToService(input: $input) {
      successfully
      error
      message
      data {
        id
        name
        tags {
          id
          name
          type
        }
      }
    }
  }
`
