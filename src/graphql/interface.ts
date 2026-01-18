export interface ApiResponse {
  code: string
  message: any
  successful: boolean
}

// Enum для статуса пользователя
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
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
