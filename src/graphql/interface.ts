export interface ApiResponse {
  code: string
  message: any
  successful: boolean
}

// Экспорт интерфейса специализации для общего использования
export interface Specialization {
  id: string
  name: string
  description: string | null
  type: 'system' | 'patient'
  createdAt: string
  updatedAt: string
}
