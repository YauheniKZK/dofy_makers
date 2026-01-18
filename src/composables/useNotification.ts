import { useNotification as useNaiveNotification } from 'naive-ui'
import type { NotificationType } from 'naive-ui'
import type { Component } from 'vue'
import { h } from 'vue'

export interface NotificationOptions {
  /** Заголовок уведомления */
  title: string
  /** Содержимое уведомления */
  content: string
  /** Тип уведомления */
  type?: NotificationType
  /** Иконка для уведомления */
  icon?: Component
  /** Длительность отображения в миллисекундах (по умолчанию 4500) */
  duration?: number
  /** Закрывать ли уведомление при клике */
  closable?: boolean
}

/**
 * Composable для создания уведомлений в приложении
 * Использует NNotificationProvider из Naive UI
 * 
 * @example
 * const { showNotification } = useNotification()
 * 
 * // Простое уведомление
 * showNotification({
 *   title: 'Успех!',
 *   content: 'Операция выполнена успешно',
 *   type: 'success'
 * })
 * 
 * @example
 * // С иконкой
 * import { CheckmarkCircle } from '@vicons/ionicons5'
 * showNotification({
 *   title: 'Готово',
 *   content: 'Данные сохранены',
 *   type: 'success',
 *   icon: CheckmarkCircle
 * })
 */
export function useNotification() {
  const notification = useNaiveNotification()

  /**
   * Показывает уведомление
   * @param options Параметры уведомления
   */
  const showNotification = (options: NotificationOptions) => {
    const {
      title,
      content,
      type = 'info',
      icon,
      duration = 4500,
      closable = true
    } = options

    notification.create({
      title,
      content,
      type,
      duration,
      closable,
      ...(icon && {
        meta: () => h(icon)
      })
    })
  }

  /**
   * Показывает уведомление об успехе
   * @param title Заголовок
   * @param content Содержимое
   * @param icon Иконка (опционально)
   */
  const showSuccess = (title: string, content: string, icon?: Component) => {
    showNotification({ title, content, type: 'success', icon })
  }

  /**
   * Показывает уведомление об ошибке
   * @param title Заголовок
   * @param content Содержимое
   * @param icon Иконка (опционально)
   */
  const showError = (title: string, content: string, icon?: Component) => {
    showNotification({ title, content, type: 'error', icon })
  }

  /**
   * Показывает информационное уведомление
   * @param title Заголовок
   * @param content Содержимое
   * @param icon Иконка (опционально)
   */
  const showInfo = (title: string, content: string, icon?: Component) => {
    showNotification({ title, content, type: 'info', icon })
  }

  /**
   * Показывает предупреждающее уведомление
   * @param title Заголовок
   * @param content Содержимое
   * @param icon Иконка (опционально)
   */
  const showWarning = (title: string, content: string, icon?: Component) => {
    showNotification({ title, content, type: 'warning', icon })
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}
