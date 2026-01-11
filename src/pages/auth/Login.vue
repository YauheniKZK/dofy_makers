<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage
} from 'naive-ui'
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const message = useMessage()
const { loginApiDataGetters } = storeToRefs(userStore)

const errorMessage = ref('');

const model = ref({
  email: '',
  password: ''
})

// Обработка входа
const handleLogin = () => {
  errorMessage.value = '';
  userStore.loginAction({
    email: model.value.email,
    password: model.value.password
  });
};

// Отслеживаем успешный вход
watch(() => loginApiDataGetters.value.success, (success) => {
  if (success) {
    message.success(loginApiDataGetters.value.message || 'Успешный вход в систему');
  }
});

// Отслеживаем ошибки при входе
watch(() => loginApiDataGetters.value.error, (error) => {
  if (error) {
    errorMessage.value = loginApiDataGetters.value.message || 'Ошибка авторизации. Проверьте данные.';
    message.error(errorMessage.value);
  }
});

</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <n-form ref="formRef" :model="model">
      <n-form-item path="email" label="Email">
        <n-input 
          v-model:value="model.email" 
          placeholder="Введите email"
          :disabled="loginApiDataGetters.loading"
          @keydown.enter.prevent="handleLogin" 
        />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="Введите пароль"
          :disabled="loginApiDataGetters.loading"
          @keydown.enter.prevent="handleLogin"
        />
      </n-form-item>
      <div v-if="errorMessage" class="text-red-500 text-sm mb-2">
        {{ errorMessage }}
      </div>
      <n-button
        type="primary"
        :loading="loginApiDataGetters.loading"
        :disabled="loginApiDataGetters.loading"
        @click="handleLogin"
        block
      >
        {{ loginApiDataGetters.loading ? 'Вход...' : 'Войти' }}
      </n-button>
    </n-form>
  </div>
</template>

<style scoped></style>
