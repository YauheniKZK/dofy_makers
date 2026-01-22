import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {

  // ------------------------STATE-----------------------------
  const isActiveFormEl = ref(false)

  // ------------------------GETTERS-----------------------------

  const isActiveFormElGetters = computed(() => isActiveFormEl.value)

  // ------------------------ACTIONS-----------------------------
  const setIsActiveFormElAction = (value: boolean) => {
    console.log('setIsActiveFormElAction', value)
    isActiveFormEl.value = value
  }
  return {
    isActiveFormEl,
    isActiveFormElGetters,
    setIsActiveFormElAction,
  }
})