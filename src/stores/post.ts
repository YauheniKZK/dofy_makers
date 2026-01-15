import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  attachTagsToPost,
  removeTagFromPost,
  incrementPostLikes,
  decrementPostLikes,
  incrementPostViews
} from '@/graphql/services/post'
import type { Post } from '@/graphql/queries/get-posts'
import type { CreatePostInput } from '@/graphql/mutations/create-post'
import type { UpdatePostInput } from '@/graphql/mutations/update-post'
import type { AttachTagsToPostInput } from '@/graphql/mutations/attach-tags-to-post'
import type { RemoveTagFromPostInput } from '@/graphql/mutations/remove-tag-from-post'

// Универсальный интерфейс для состояния запроса
interface ApiState<T = any> {
  data: T | null
  loading: boolean
  success: boolean
  error: boolean
  message: string
}

// Универсальная функция для создания дефолтного состояния
const createDefaultApiState = <T = any>(): ApiState<T> => ({
  data: null,
  loading: false,
  success: false,
  error: false,
  message: ''
})

// Универсальная функция для сброса состояния
const resetApiState = <T = any>(state: ApiState<T>): void => {
  state.data = null
  state.loading = false
  state.success = false
  state.error = false
  state.message = ''
}

export const usePostStore = defineStore('post', () => {
  // -----------------STATE---------------------
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)

  // Состояния для каждого API запроса
  const getPostsApiData = ref<ApiState<{ posts: Post[]; total: number }>>(createDefaultApiState<{ posts: Post[]; total: number }>())
  const getPostApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const createPostApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const updatePostApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const deletePostApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const attachTagsToPostApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const removeTagFromPostApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const incrementPostLikesApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const decrementPostLikesApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())
  const incrementPostViewsApiData = ref<ApiState<Post>>(createDefaultApiState<Post>())

  // -----------------GETTERS---------------------
  const postsGetters = computed(() => posts.value)
  const currentPostGetters = computed(() => currentPost.value)

  // Геттеры для API состояний
  const getPostsApiDataGetters = computed(() => getPostsApiData.value)
  const getPostApiDataGetters = computed(() => getPostApiData.value)
  const createPostApiDataGetters = computed(() => createPostApiData.value)
  const updatePostApiDataGetters = computed(() => updatePostApiData.value)
  const deletePostApiDataGetters = computed(() => deletePostApiData.value)
  const attachTagsToPostApiDataGetters = computed(() => attachTagsToPostApiData.value)
  const removeTagFromPostApiDataGetters = computed(() => removeTagFromPostApiData.value)
  const incrementPostLikesApiDataGetters = computed(() => incrementPostLikesApiData.value)
  const decrementPostLikesApiDataGetters = computed(() => decrementPostLikesApiData.value)
  const incrementPostViewsApiDataGetters = computed(() => incrementPostViewsApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список постов
  const fetchPosts = async (params?: { userId?: string; isPublished?: boolean; limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getPostsApiData.value)
    getPostsApiData.value.loading = true

    try {
      const response = await getPosts(params)

      if (response.data?.posts?.successfully && response.data.posts.data) {
        const data = response.data.posts.data
        posts.value = data.posts
        getPostsApiData.value.data = data
        getPostsApiData.value.success = true
        getPostsApiData.value.message = response.data.posts.message || 'Посты загружены'
      } else {
        const errorMsg = response.data?.posts?.error || response.data?.posts?.message || 'Ошибка загрузки постов'
        getPostsApiData.value.error = true
        getPostsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки постов'
      getPostsApiData.value.error = true
      getPostsApiData.value.message = errorMessage
    } finally {
      getPostsApiData.value.loading = false
    }
  }

  // Получить пост по ID
  const fetchPost = async (id: string): Promise<Post | null> => {
    resetApiState(getPostApiData.value)
    getPostApiData.value.loading = true

    try {
      const response = await getPost(id)

      if (response.data?.post?.successfully && response.data.post.data) {
        const post = response.data.post.data as Post
        currentPost.value = post
        getPostApiData.value.data = post
        getPostApiData.value.success = true
        getPostApiData.value.message = response.data.post.message || 'Пост загружен'
        return post
      } else {
        const errorMsg = response.data?.post?.error || response.data?.post?.message || 'Пост не найден'
        getPostApiData.value.error = true
        getPostApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки поста'
      getPostApiData.value.error = true
      getPostApiData.value.message = errorMessage
      return null
    } finally {
      getPostApiData.value.loading = false
    }
  }

  // Создать пост
  const createPostAction = async (input: CreatePostInput): Promise<Post | null> => {
    resetApiState(createPostApiData.value)
    createPostApiData.value.loading = true

    try {
      const response = await createPost(input)

      if (response.data?.createPost?.successfully && response.data.createPost.data) {
        const post = response.data.createPost.data as any
        createPostApiData.value.data = post
        createPostApiData.value.success = true
        createPostApiData.value.message = response.data.createPost.message || 'Пост создан'
        
        // Добавляем в список постов
        posts.value.unshift(post)
        
        return post
      } else {
        const errorMsg = response.data?.createPost?.error || response.data?.createPost?.message || 'Ошибка создания поста'
        createPostApiData.value.error = true
        createPostApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания поста'
      createPostApiData.value.error = true
      createPostApiData.value.message = errorMessage
      return null
    } finally {
      createPostApiData.value.loading = false
    }
  }

  // Обновить пост
  const updatePostAction = async (input: UpdatePostInput): Promise<Post | null> => {
    resetApiState(updatePostApiData.value)
    updatePostApiData.value.loading = true

    try {
      const response = await updatePost(input)

      if (response.data?.updatePost?.successfully && response.data.updatePost.data) {
        const updatedPost = response.data.updatePost.data as any
        updatePostApiData.value.data = updatedPost
        updatePostApiData.value.success = true
        updatePostApiData.value.message = response.data.updatePost.message || 'Пост обновлен'
        
        // Обновляем в списке постов
        const index = posts.value.findIndex(p => p.id === input.postId)
        if (index !== -1) {
          posts.value[index] = { ...posts.value[index], ...updatedPost }
        }
        
        // Обновляем текущий пост
        if (currentPost.value?.id === input.postId) {
          currentPost.value = { ...currentPost.value, ...updatedPost }
        }
        
        return updatedPost
      } else {
        const errorMsg = response.data?.updatePost?.error || response.data?.updatePost?.message || 'Ошибка обновления поста'
        updatePostApiData.value.error = true
        updatePostApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления поста'
      updatePostApiData.value.error = true
      updatePostApiData.value.message = errorMessage
      return null
    } finally {
      updatePostApiData.value.loading = false
    }
  }

  // Удалить пост
  const deletePostAction = async (postId: string): Promise<boolean> => {
    resetApiState(deletePostApiData.value)
    deletePostApiData.value.loading = true

    try {
      const response = await deletePost(postId)

      if (response.data?.deletePost?.successfully) {
        deletePostApiData.value.data = true
        deletePostApiData.value.success = true
        deletePostApiData.value.message = response.data.deletePost.message || 'Пост удален'
        
        // Удаляем из списка постов
        posts.value = posts.value.filter(p => p.id !== postId)
        
        // Очищаем текущий пост, если это он
        if (currentPost.value?.id === postId) {
          currentPost.value = null
        }
        
        return true
      } else {
        const errorMsg = response.data?.deletePost?.error || response.data?.deletePost?.message || 'Ошибка удаления поста'
        deletePostApiData.value.error = true
        deletePostApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления поста'
      deletePostApiData.value.error = true
      deletePostApiData.value.message = errorMessage
      return false
    } finally {
      deletePostApiData.value.loading = false
    }
  }

  // Прикрепить теги к посту
  const attachTagsToPostAction = async (input: AttachTagsToPostInput): Promise<Post | null> => {
    resetApiState(attachTagsToPostApiData.value)
    attachTagsToPostApiData.value.loading = true

    try {
      const response = await attachTagsToPost(input)

      if (response.data?.attachTagsToPost?.successfully && response.data.attachTagsToPost.data) {
        const postWithTags = response.data.attachTagsToPost.data as any
        attachTagsToPostApiData.value.data = postWithTags
        attachTagsToPostApiData.value.success = true
        attachTagsToPostApiData.value.message = response.data.attachTagsToPost.message || 'Теги прикреплены'
        
        // Обновляем пост в списке
        const index = posts.value.findIndex(p => p.id === input.postId)
        if (index !== -1 && posts.value[index].tags) {
          posts.value[index].tags = postWithTags.tags
        }
        
        return postWithTags
      } else {
        const errorMsg = response.data?.attachTagsToPost?.error || response.data?.attachTagsToPost?.message || 'Ошибка прикрепления тегов'
        attachTagsToPostApiData.value.error = true
        attachTagsToPostApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка прикрепления тегов'
      attachTagsToPostApiData.value.error = true
      attachTagsToPostApiData.value.message = errorMessage
      return null
    } finally {
      attachTagsToPostApiData.value.loading = false
    }
  }

  // Удалить тег из поста
  const removeTagFromPostAction = async (input: RemoveTagFromPostInput): Promise<Post | null> => {
    resetApiState(removeTagFromPostApiData.value)
    removeTagFromPostApiData.value.loading = true

    try {
      const response = await removeTagFromPost(input)

      if (response.data?.removeTagFromPost?.successfully && response.data.removeTagFromPost.data) {
        const postWithTags = response.data.removeTagFromPost.data as any
        removeTagFromPostApiData.value.data = postWithTags
        removeTagFromPostApiData.value.success = true
        removeTagFromPostApiData.value.message = response.data.removeTagFromPost.message || 'Тег удален'
        
        // Обновляем пост в списке
        const index = posts.value.findIndex(p => p.id === input.postId)
        if (index !== -1 && posts.value[index].tags) {
          posts.value[index].tags = postWithTags.tags
        }
        
        return postWithTags
      } else {
        const errorMsg = response.data?.removeTagFromPost?.error || response.data?.removeTagFromPost?.message || 'Ошибка удаления тега'
        removeTagFromPostApiData.value.error = true
        removeTagFromPostApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления тега'
      removeTagFromPostApiData.value.error = true
      removeTagFromPostApiData.value.message = errorMessage
      return null
    } finally {
      removeTagFromPostApiData.value.loading = false
    }
  }

  // Увеличить количество лайков поста
  const incrementPostLikesAction = async (postId: string): Promise<Post | null> => {
    resetApiState(incrementPostLikesApiData.value)
    incrementPostLikesApiData.value.loading = true

    try {
      const response = await incrementPostLikes(postId)

      if (response.data?.incrementPostLikes?.successfully && response.data.incrementPostLikes.data) {
        const post = response.data.incrementPostLikes.data as any
        incrementPostLikesApiData.value.data = post
        incrementPostLikesApiData.value.success = true
        incrementPostLikesApiData.value.message = response.data.incrementPostLikes.message || 'Лайк добавлен'
        
        // Обновляем пост в списке
        const index = posts.value.findIndex(p => p.id === postId)
        if (index !== -1) {
          posts.value[index].likesCount = post.likesCount
        }
        
        // Обновляем текущий пост
        if (currentPost.value?.id === postId) {
          currentPost.value.likesCount = post.likesCount
        }
        
        return post
      } else {
        const errorMsg = response.data?.incrementPostLikes?.error || response.data?.incrementPostLikes?.message || 'Ошибка добавления лайка'
        incrementPostLikesApiData.value.error = true
        incrementPostLikesApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления лайка'
      incrementPostLikesApiData.value.error = true
      incrementPostLikesApiData.value.message = errorMessage
      return null
    } finally {
      incrementPostLikesApiData.value.loading = false
    }
  }

  // Уменьшить количество лайков поста
  const decrementPostLikesAction = async (postId: string): Promise<Post | null> => {
    resetApiState(decrementPostLikesApiData.value)
    decrementPostLikesApiData.value.loading = true

    try {
      const response = await decrementPostLikes(postId)

      if (response.data?.decrementPostLikes?.successfully && response.data.decrementPostLikes.data) {
        const post = response.data.decrementPostLikes.data as any
        decrementPostLikesApiData.value.data = post
        decrementPostLikesApiData.value.success = true
        decrementPostLikesApiData.value.message = response.data.decrementPostLikes.message || 'Лайк удален'
        
        // Обновляем пост в списке
        const index = posts.value.findIndex(p => p.id === postId)
        if (index !== -1) {
          posts.value[index].likesCount = post.likesCount
        }
        
        // Обновляем текущий пост
        if (currentPost.value?.id === postId) {
          currentPost.value.likesCount = post.likesCount
        }
        
        return post
      } else {
        const errorMsg = response.data?.decrementPostLikes?.error || response.data?.decrementPostLikes?.message || 'Ошибка удаления лайка'
        decrementPostLikesApiData.value.error = true
        decrementPostLikesApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления лайка'
      decrementPostLikesApiData.value.error = true
      decrementPostLikesApiData.value.message = errorMessage
      return null
    } finally {
      decrementPostLikesApiData.value.loading = false
    }
  }

  // Увеличить количество просмотров поста
  const incrementPostViewsAction = async (postId: string): Promise<Post | null> => {
    resetApiState(incrementPostViewsApiData.value)
    incrementPostViewsApiData.value.loading = true

    try {
      const response = await incrementPostViews(postId)

      if (response.data?.incrementPostViews?.successfully && response.data.incrementPostViews.data) {
        const post = response.data.incrementPostViews.data as any
        incrementPostViewsApiData.value.data = post
        incrementPostViewsApiData.value.success = true
        incrementPostViewsApiData.value.message = response.data.incrementPostViews.message || 'Просмотр добавлен'
        
        // Обновляем пост в списке
        const index = posts.value.findIndex(p => p.id === postId)
        if (index !== -1) {
          posts.value[index].views = post.views
        }
        
        // Обновляем текущий пост
        if (currentPost.value?.id === postId) {
          currentPost.value.views = post.views
        }
        
        return post
      } else {
        const errorMsg = response.data?.incrementPostViews?.error || response.data?.incrementPostViews?.message || 'Ошибка добавления просмотра'
        incrementPostViewsApiData.value.error = true
        incrementPostViewsApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления просмотра'
      incrementPostViewsApiData.value.error = true
      incrementPostViewsApiData.value.message = errorMessage
      return null
    } finally {
      incrementPostViewsApiData.value.loading = false
    }
  }

  return {
    // State
    posts,
    currentPost,
    
    // API States
    getPostsApiData,
    getPostApiData,
    createPostApiData,
    updatePostApiData,
    deletePostApiData,
    attachTagsToPostApiData,
    removeTagFromPostApiData,
    incrementPostLikesApiData,
    decrementPostLikesApiData,
    incrementPostViewsApiData,
    
    // Getters
    postsGetters,
    currentPostGetters,
    
    // API Data Getters
    getPostsApiDataGetters,
    getPostApiDataGetters,
    createPostApiDataGetters,
    updatePostApiDataGetters,
    deletePostApiDataGetters,
    attachTagsToPostApiDataGetters,
    removeTagFromPostApiDataGetters,
    incrementPostLikesApiDataGetters,
    decrementPostLikesApiDataGetters,
    incrementPostViewsApiDataGetters,
    
    // Actions
    fetchPosts,
    fetchPost,
    createPostAction,
    updatePostAction,
    deletePostAction,
    attachTagsToPostAction,
    removeTagFromPostAction,
    incrementPostLikesAction,
    decrementPostLikesAction,
    incrementPostViewsAction
  }
})
