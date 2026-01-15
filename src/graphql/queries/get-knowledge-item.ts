import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
  slug: string
}

export interface KnowledgeItemCategory {
  id: string
  name: string
  description: string | null
}

export interface KnowledgeItemSubcategory {
  id: string
  name: string
}

export interface KnowledgeItemAuthor {
  id: string
  name: string
  description: string | null
}

export interface KnowledgeItem {
  id: string
  categoryId: string
  category?: KnowledgeItemCategory
  subcategoryId: string | null
  subcategory?: KnowledgeItemSubcategory
  authorId: string
  author?: KnowledgeItemAuthor
  title: string
  content: string | null
  images: string[]
  isActive: boolean
  tags?: Tag[]
  createdAt: string
  updatedAt: string
}

export interface GetKnowledgeItemResult {
  knowledgeItem: {
    successfully: boolean
    error: string | null
    message: string | null
    data: KnowledgeItem | null
  }
}

export const GET_KNOWLEDGE_ITEM = gql`
  query GetKnowledgeItem($id: ID!) {
    knowledgeItem(id: $id) {
      successfully
      error
      message
      data {
        id
        categoryId
        category {
          id
          name
          description
        }
        subcategoryId
        subcategory {
          id
          name
        }
        authorId
        author {
          id
          name
          description
        }
        title
        content
        images
        isActive
        tags {
          id
          name
          type
          slug
        }
        createdAt
        updatedAt
      }
    }
  }
`
