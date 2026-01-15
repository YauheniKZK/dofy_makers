import gql from 'graphql-tag'

export interface Tag {
  id: string
  name: string
  type: string
}

export interface KnowledgeItemCategory {
  id: string
  name: string
}

export interface KnowledgeItemSubcategory {
  id: string
  name: string
}

export interface KnowledgeItemAuthor {
  id: string
  name: string
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

export interface GetKnowledgeItemsResult {
  knowledgeItems: {
    successfully: boolean
    error: string | null
    message: string | null
    data: {
      items: KnowledgeItem[]
      total: number
    }
  }
}

export const GET_KNOWLEDGE_ITEMS = gql`
  query GetKnowledgeItems($categoryId: ID, $subcategoryId: ID, $authorId: ID, $limit: Int, $offset: Int) {
    knowledgeItems(categoryId: $categoryId, subcategoryId: $subcategoryId, authorId: $authorId, limit: $limit, offset: $offset) {
      successfully
      error
      message
      data {
        items {
          id
          categoryId
          category {
            id
            name
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
          }
          title
          content
          images
          isActive
          tags {
            id
            name
            type
          }
          createdAt
          updatedAt
        }
        total
      }
    }
  }
`
