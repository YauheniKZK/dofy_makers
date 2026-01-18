<template>
  <div class="flex flex-col gap-4 grow">
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-bold">Добавить товар</h2>
      <p class="text-sm text-gray-600">Заполните форму для создания нового товара</p>
    </div>

    <n-form ref="formRef" :model="formModel" :rules="formRules" label-placement="top">
      <n-form-item label="Фото" path="subcategoryId">
        <n-upload
          multiple
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          list-type="image-card"
          :max="6"
          @preview="handlePreview"
        />
      </n-form-item>
      <n-form-item label="Подкатегория" path="subcategoryId">
        <n-select
          v-model:value="formModel.subcategoryId"
          :options="subcategoryOptions"
          placeholder="Выберите подкатегорию"
          filterable
          :loading="categoryStore.getSubcategoriesApiDataGetters.loading"
          :disabled="categoryStore.getSubcategoriesApiDataGetters.loading"
          @update:value="handleSubcategoryChange"
        />
      </n-form-item>

      <n-form-item label="Название" path="name">
        <n-input
          v-model:value="formModel.name"
          placeholder="Введите название товара"
          :disabled="productStore.createProductApiDataGetters.loading"
        />
      </n-form-item>

      <n-form-item label="Описание" path="description">
        <n-input
          v-model:value="formModel.description"
          type="textarea"
          placeholder="Введите описание товара"
          :rows="4"
          :disabled="productStore.createProductApiDataGetters.loading"
        />
      </n-form-item>

      <div class="flex gap-4">
        <n-form-item label="Цена" path="price" class="flex-1">
          <n-input-number
            v-model:value="formModel.price"
            placeholder="0"
            :min="0"
            :precision="2"
            :show-button="false"
            :disabled="productStore.createProductApiDataGetters.loading"
            class="w-full"
          />
        </n-form-item>

        <n-form-item label="Валюта" path="currency" class="flex-1">
          <n-select
            v-model:value="formModel.currency"
            :options="currencyOptions"
            placeholder="Выберите валюту"
            :disabled="productStore.createProductApiDataGetters.loading"
          />
        </n-form-item>
      </div>

      <n-form-item label="Настройки">
        <div class="flex flex-col gap-2">
          <n-switch v-model:value="formModel.isActive" :disabled="productStore.createProductApiDataGetters.loading">
            <template #checked>Активен</template>
            <template #unchecked>Неактивен</template>
          </n-switch>

          <n-switch v-model:value="formModel.isPublished" :disabled="productStore.createProductApiDataGetters.loading">
            <template #checked>Опубликован</template>
            <template #unchecked>Не опубликован</template>
          </n-switch>

          <n-switch v-model:value="formModel.allowCoupons" :disabled="productStore.createProductApiDataGetters.loading">
            <template #checked>Разрешены купоны</template>
            <template #unchecked>Купоны запрещены</template>
          </n-switch>
        </div>
      </n-form-item>

      <div v-if="productStore.createProductApiDataGetters.error" class="text-red-500 text-sm">
        {{ productStore.createProductApiDataGetters.message }}
      </div>

      <div class="flex gap-2 pt-2">
        <n-button
          type="primary"
          :loading="productStore.createProductApiDataGetters.loading"
          :disabled="productStore.createProductApiDataGetters.loading"
          @click="handleSubmit"
          block
        >
          {{ productStore.createProductApiDataGetters.loading ? 'Создание...' : 'Создать товар' }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSwitch,
  NInputNumber,
  NButton,
  NUpload
} from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import type { CreateProductInput } from '@/graphql/mutations/create-product'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const router = useRouter()

const { createProductApiDataGetters } = storeToRefs(productStore)
const { subcategoriesGetters, getSubcategoriesApiDataGetters } = storeToRefs(categoryStore)

const formRef = ref<FormInst | null>(null)

const formModel = ref<CreateProductInput>({
  subcategoryId: '',
  name: '',
  description: '',
  price: 0,
  currency: 'RUB',
  images: [],
  isActive: true,
  isPublished: false,
  allowCoupons: false,
  tagIds: [],
  materialIds: [],
})

const formRules: FormRules = {
  subcategoryId: [
    {
      required: true,
      message: 'Выберите подкатегорию',
      trigger: ['blur', 'change'],
    },
  ],
  name: [
    {
      required: true,
      message: 'Введите название товара',
      trigger: ['input', 'blur'],
    },
  ],
  price: [
    {
      required: true,
      message: 'Введите цену товара',
      trigger: ['input', 'blur'],
    },
    {
      type: 'number',
      min: 0,
      message: 'Цена должна быть больше или равна 0',
      trigger: ['input', 'blur'],
    },
  ],
  currency: [
    {
      required: true,
      message: 'Выберите валюту',
      trigger: ['blur', 'change'],
    },
  ],
}

const currencyOptions = [
  { label: 'RUB (₽)', value: 'RUB' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
]

const subcategoryOptions = computed(() => {
  return subcategoriesGetters.value.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory.id,
  }))
})

const handleSubcategoryChange = (value: string | null) => {
  formModel.value.subcategoryId = value || ''
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    const result = await productStore.createProductAction(formModel.value)
    
    if (result) {
      // message.success('Товар успешно создан')
      // Можно добавить редирект или закрытие модального окна
      router.back()
    } else {
      const errorMsg = createProductApiDataGetters.value.message || 'Ошибка создания товара'
      // message.error(errorMsg)
    }
  } catch (error: any) {
    console.error('Ошибка валидации формы:', error)
  }
}

const handlePreview = (file: UploadFileInfo) => {
  const { url } = file
  console.log('url', url);
}

// Загружаем подкатегории при монтировании
onMounted(async () => {
  if (subcategoriesGetters.value.length === 0) {
    await categoryStore.fetchSubcategories()
  }
})

// Отслеживаем успешное создание товара
watch(
  () => createProductApiDataGetters.value.success,
  (success) => {
    if (success) {
      // Сброс формы после успешного создания
      formModel.value = {
        subcategoryId: '',
        name: '',
        description: '',
        price: 0,
        currency: 'RUB',
        images: [],
        isActive: true,
        isPublished: false,
        allowCoupons: false,
        tagIds: [],
        materialIds: [],
      }
      formRef.value?.restoreValidation()
    }
  }
)
</script>

<style scoped></style>