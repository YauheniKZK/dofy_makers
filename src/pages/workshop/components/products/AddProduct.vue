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
      <n-form-item label="Тип товара">
        <n-radio-group v-model:value="productType" :disabled="productStore.createProductApiDataGetters.loading">
          <n-radio value="PRODUCT">Обычный товар</n-radio>
          <n-radio value="BUNDLE">Набор/комплект</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- Форма для обычного товара -->
      <template v-if="productType === 'PRODUCT'">
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
      </template>

      <!-- Форма для набора -->
      <div v-if="productType === 'BUNDLE'" class="flex flex-col gap-4">
        <!-- Выбор существующих товаров (над табами) -->
        <n-form-item label="Добавить существующий товар">
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <n-select
                v-model:value="selectedExistingProductId"
                :options="availableProductsOptions"
                placeholder="Выберите товар из списка"
                filterable
                :loading="productStore.getProductsApiDataGetters.loading"
                :disabled="productStore.createProductApiDataGetters.loading || productStore.getProductsApiDataGetters.loading"
                class="flex-1"
                @update:value="handleSelectExistingProduct"
              />
              <n-input-number
                v-if="selectedExistingProductId"
                v-model:value="selectedExistingProductQuantity"
                :min="1"
                :max="99"
                placeholder="Количество"
                :show-button="false"
                class="w-32"
              />
              <n-button
                v-if="selectedExistingProductId"
                type="primary"
                :disabled="!selectedExistingProductId || productStore.createProductApiDataGetters.loading"
                @click="addExistingProductToBundle"
              >
                Добавить
              </n-button>
            </div>
            <div v-if="availableProductsOptions.length === 0 && !productStore.getProductsApiDataGetters.loading" class="text-xs text-gray-500">
              У вас пока нет товаров для добавления в набор. Создайте новый товар во вкладке ниже.
            </div>
          </div>
        </n-form-item>

        <!-- Вкладки для товаров в наборе -->
        <n-form-item label="Товары в наборе">
          <n-tabs
            v-model:value="activeTab"
            type="card"
            addable
            closable
            :tab-style="{ minWidth: '120px' }"
            @add="handleAddTab"
            @close="handleCloseTab"
            @update:value="handleTabChange"
          >
            <!-- Первый таб: основная форма набора -->
            <n-tab-pane name="main-product" tab="Основной товар" :closable="false">
              <div class="flex flex-col gap-4 py-4">
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
                    placeholder="Введите название набора"
                    :disabled="productStore.createProductApiDataGetters.loading"
                  />
                </n-form-item>

                <n-form-item label="Описание" path="description">
                  <n-input
                    v-model:value="formModel.description"
                    type="textarea"
                    placeholder="Введите описание набора"
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
              </div>
            </n-tab-pane>

            <!-- Вкладки для новых товаров -->
            <n-tab-pane
              v-for="tab in newProductTabs"
              :key="tab.id"
              :name="tab.id"
              :tab="tab.name"
            >
              <div class="flex flex-col gap-4 py-4">
                <n-form :model="tab.form" :rules="newProductFormRules" label-placement="top" ref="(el) => setTabFormRef(tab.id, el)">
                  <n-form-item label="Подкатегория" :path="`${tab.id}.subcategoryId`">
                    <n-select
                      v-model:value="tab.form.subcategoryId"
                      :options="subcategoryOptions"
                      placeholder="Выберите подкатегорию"
                      filterable
                      :loading="categoryStore.getSubcategoriesApiDataGetters.loading"
                      :disabled="categoryStore.getSubcategoriesApiDataGetters.loading"
                    />
                  </n-form-item>

                  <n-form-item label="Название" :path="`${tab.id}.name`">
                    <n-input
                      v-model:value="tab.form.name"
                      placeholder="Введите название товара"
                      :disabled="productStore.createProductApiDataGetters.loading"
                    />
                  </n-form-item>

                  <n-form-item label="Описание" :path="`${tab.id}.description`">
                    <n-input
                      v-model:value="tab.form.description"
                      type="textarea"
                      placeholder="Введите описание товара"
                      :rows="3"
                      :disabled="productStore.createProductApiDataGetters.loading"
                    />
                  </n-form-item>

                  <div class="flex gap-4">
                    <n-form-item label="Цена" :path="`${tab.id}.price`" class="flex-1">
                      <n-input-number
                        v-model:value="tab.form.price"
                        placeholder="0"
                        :min="0"
                        :precision="2"
                        :show-button="false"
                        :disabled="productStore.createProductApiDataGetters.loading"
                        class="w-full"
                      />
                    </n-form-item>

                    <n-form-item label="Валюта" :path="`${tab.id}.currency`" class="flex-1">
                      <n-select
                        v-model:value="tab.form.currency"
                        :options="currencyOptions"
                        placeholder="Выберите валюту"
                        :disabled="productStore.createProductApiDataGetters.loading"
                      />
                    </n-form-item>
                  </div>

                  <div class="flex items-center gap-2">
                    <n-input-number
                      v-model:value="tab.quantity"
                      :min="1"
                      :max="99"
                      placeholder="Количество"
                      :show-button="false"
                      class="w-32"
                    />
                    <span class="text-sm text-gray-600">Количество в наборе</span>
                  </div>
                  
                  <div class="flex gap-2 pt-2">
                    <n-button
                      type="primary"
                      :disabled="productStore.createProductApiDataGetters.loading || !tab.form.name"
                      @click="addNewProductToBundle(tab)"
                      block
                    >
                      {{ isProductInBundle(tab.form.name) ? 'Товар уже в наборе' : 'Добавить в набор' }}
                    </n-button>
                  </div>
                </n-form>
              </div>
            </n-tab-pane>
          </n-tabs>
        </n-form-item>

        <!-- Список добавленных товаров в набор -->
        <div v-if="bundleItems.length > 0" class="flex flex-col gap-2">
          <div class="text-sm font-medium">Товары в наборе ({{ bundleItems.length }}):</div>
          <div
            v-for="(item, index) in bundleItems"
            :key="`${item.productId || item.newProductName}-${index}`"
            class="flex items-center gap-2 p-3 bg-gray-50 rounded"
          >
            <div class="flex-1">
              <div class="text-sm font-medium">
                {{ item.productId ? getProductName(item.productId) : item.newProductName }}
              </div>
              <div v-if="item.productId" class="text-xs text-gray-500">Существующий товар</div>
              <div v-else class="text-xs text-blue-500">Новый товар</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Количество:</span>
              <n-input-number
                v-model:value="item.quantity"
                :min="1"
                :max="99"
                :show-button="false"
                :disabled="productStore.createProductApiDataGetters.loading"
                class="w-20"
                @update:value="updateBundleItemQuantity(index, $event)"
              />
            </div>
            <n-button
              size="small"
              type="error"
              :disabled="productStore.createProductApiDataGetters.loading"
              @click="removeBundleItem(index)"
            >
              Удалить
            </n-button>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 py-2">
          Добавьте товары в набор, используя вкладки выше
        </div>
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
  NUpload,
  NRadioGroup,
  NRadio,
  NTabs,
  NTabPane
} from 'naive-ui'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import type { CreateProductInput, ProductBundleItemInput, CreateProductForBundleInput } from '@/graphql/mutations/create-product'
import type { Product } from '@/graphql/queries/get-products'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()
const router = useRouter()

const { createProductApiDataGetters, productsGetters, getProductsApiDataGetters } = storeToRefs(productStore)
const { subcategoriesGetters, getSubcategoriesApiDataGetters } = storeToRefs(categoryStore)
const { currentUserGetters } = storeToRefs(userStore)

const formRef = ref<FormInst | null>(null)
const productType = ref<'PRODUCT' | 'BUNDLE'>('PRODUCT')
const activeTab = ref<string>('select-existing')
const selectedExistingProductId = ref<string | null>(null)
const selectedExistingProductQuantity = ref<number>(1)

interface NewProductTab {
  id: string
  name: string
  form: CreateProductForBundleInput & { currency: string }
  quantity: number
}

const newProductTabs = ref<NewProductTab[]>([])
const tabFormRefs = ref<Record<string, FormInst | null>>({})

interface BundleItem {
  productId?: string
  newProduct?: CreateProductForBundleInput
  newProductName?: string
  quantity: number
  order: number
}

const bundleItems = ref<BundleItem[]>([])

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
  ]
}

const newProductFormRules: FormRules = {
  name: [
    {
      required: true,
      message: 'Введите название товара',
      trigger: ['input', 'blur'],
    },
  ]
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

// Фильтруем товары: только обычные товары (не наборы) и только свои товары
const availableProductsOptions = computed(() => {
  return productsGetters.value
    .filter((product: Product) => product.productType !== 'BUNDLE')
    .map((product: Product) => ({
      label: product.name,
      value: product.id,
    }))
})

const getProductName = (productId: string): string => {
  const product = productsGetters.value.find((p: Product) => p.id === productId)
  return product?.name || productId
}

const isProductInBundle = (productName: string): boolean => {
  return bundleItems.value.some(item => 
    item.newProductName === productName || 
    (item.productId && getProductName(item.productId) === productName)
  )
}

const setTabFormRef = (tabId: string, el: FormInst | null) => {
  if (el) {
    tabFormRefs.value[tabId] = el
  }
}

const handleAddTab = () => {
  const tabId = `new-product-${Date.now()}`
  const tabNumber = newProductTabs.value.length + 1
  newProductTabs.value.push({
    id: tabId,
    name: `Товар ${tabNumber}`,
    form: {
      name: '',
      description: '',
      price: 0,
      currency: 'RUB',
      isActive: true,
      isPublished: true,
      allowCoupons: false,
      tagIds: [],
      materialIds: [],
    },
    quantity: 1,
  })
  activeTab.value = tabId
}

const handleCloseTab = (tabId: string) => {
  const index = newProductTabs.value.findIndex(tab => tab.id === tabId)
  if (index !== -1) {
    // Удаляем товар из набора, если он был добавлен
    bundleItems.value = bundleItems.value.filter(item => {
      if (!item.productId && item.newProduct) {
        // Проверяем, соответствует ли этот товар удаляемой вкладке
        const tab = newProductTabs.value[index]
        return item.newProductName !== tab.form.name
      }
      return true
    })
    
    newProductTabs.value.splice(index, 1)
    delete tabFormRefs.value[tabId]
    
    // Переключаемся на другую вкладку
    if (activeTab.value === tabId) {
      if (newProductTabs.value.length > 0) {
        activeTab.value = newProductTabs.value[0].id
      } else {
        activeTab.value = 'main-product'
      }
    }
    
    // Обновляем порядок
    updateBundleItemsOrder()
  }
}

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}

const handleSelectExistingProduct = (productId: string | null) => {
  selectedExistingProductId.value = productId
}

const addExistingProductToBundle = () => {
  if (!selectedExistingProductId.value) return
  
  // Проверяем, не добавлен ли уже этот товар
  if (bundleItems.value.some(item => item.productId === selectedExistingProductId.value)) {
    return
  }
  
  bundleItems.value.push({
    productId: selectedExistingProductId.value,
    quantity: selectedExistingProductQuantity.value || 1,
    order: bundleItems.value.length,
  })
  
  // Сбрасываем выбор
  selectedExistingProductId.value = null
  selectedExistingProductQuantity.value = 1
  
  updateBundleItemsOrder()
}

const updateExistingProductInBundle = (productId: string, quantity: number) => {
  const item = bundleItems.value.find(item => item.productId === productId)
  if (item) {
    item.quantity = quantity
  }
}

const addNewProductToBundle = async (tab: NewProductTab) => {
  // Валидация формы нового товара
  const formRef = tabFormRefs.value[tab.id]
  if (formRef) {
    try {
      await formRef.validate()
    } catch (error) {
      console.error('Ошибка валидации формы нового товара:', error)
      return
    }
  }
  
  // Проверяем, не добавлен ли уже этот товар
  if (bundleItems.value.some(item => item.newProductName === tab.form.name)) {
    return
  }
  
  bundleItems.value.push({
    newProduct: {
      name: tab.form.name,
      description: tab.form.description,
      price: tab.form.price,
      currency: tab.form.currency,
      subcategoryId: tab.form.subcategoryId,
      isActive: tab.form.isActive ?? true,
      isPublished: tab.form.isPublished ?? true,
      allowCoupons: tab.form.allowCoupons ?? false,
      tagIds: tab.form.tagIds,
      materialIds: tab.form.materialIds,
    },
    newProductName: tab.form.name,
    quantity: tab.quantity || 1,
    order: bundleItems.value.length,
  })
  
  updateBundleItemsOrder()
}

const updateBundleItemsOrder = () => {
  bundleItems.value.forEach((item, index) => {
    item.order = index
  })
}

const updateBundleItemQuantity = (index: number, quantity: number | null) => {
  if (quantity !== null && quantity > 0) {
    bundleItems.value[index].quantity = quantity
  }
}

const removeBundleItem = (index: number) => {
  bundleItems.value.splice(index, 1)
  updateBundleItemsOrder()
}

const handleSubcategoryChange = (value: string | null) => {
  formModel.value.subcategoryId = value || ''
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    if (productType.value === 'BUNDLE') {
      // Валидация для набора
      if (bundleItems.value.length === 0) {
        // Показываем ошибку через сообщение
        console.error('Набор должен содержать хотя бы один товар')
        return
      }
      
      // Проверяем, что все новые товары из вкладок добавлены в набор
      for (const tab of newProductTabs.value) {
        const isAdded = bundleItems.value.some(item => item.newProductName === tab.form.name)
        if (!isAdded && tab.form.name) {
          // Автоматически добавляем товар из вкладки
          await addNewProductToBundle(tab)
        }
      }
      
      // Создаем набор с bundleItems
      const bundleInput: CreateProductInput = {
        ...formModel.value,
        productType: 'BUNDLE',
        bundleItems: bundleItems.value.map((item) => {
          const bundleItem: ProductBundleItemInput = {
            quantity: item.quantity || 1,
            order: item.order,
          }
          
          if (item.productId) {
            bundleItem.productId = item.productId
          } else if (item.newProduct) {
            bundleItem.newProduct = item.newProduct
          }
          
          return bundleItem
        }),
      }
      
      const result = await productStore.createProductAction(bundleInput)
      
      if (result) {
        router.back()
      } else {
        const errorMsg = createProductApiDataGetters.value.message || 'Ошибка создания набора'
        console.error(errorMsg)
      }
    } else {
      // Создаем обычный товар
      const productInput: CreateProductInput = {
        ...formModel.value,
        productType: 'PRODUCT',
      }
      
      const result = await productStore.createProductAction(productInput)
      
      if (result) {
        router.back()
      } else {
        const errorMsg = createProductApiDataGetters.value.message || 'Ошибка создания товара'
        console.error(errorMsg)
      }
    }
  } catch (error: any) {
    console.error('Ошибка валидации формы:', error)
  }
}

const handlePreview = (file: UploadFileInfo) => {
  const { url } = file
  console.log('url', url);
}

// Загружаем подкатегории и товары при монтировании
onMounted(async () => {
  if (subcategoriesGetters.value.length === 0) {
    await categoryStore.fetchSubcategories()
  }
  
  // Загружаем товары пользователя для выбора в набор
  if (currentUserGetters.value?.id && productsGetters.value.length === 0) {
    await productStore.fetchProducts({
      userId: currentUserGetters.value.id
    })
  }
})

// Сбрасываем bundleItems при изменении типа товара
watch(productType, (newType) => {
  if (newType === 'PRODUCT') {
    bundleItems.value = []
    newProductTabs.value = []
    activeTab.value = 'main-product'
    selectedExistingProductId.value = null
    selectedExistingProductQuantity.value = 1
  } else {
    activeTab.value = 'main-product'
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
      productType.value = 'PRODUCT'
      bundleItems.value = []
      newProductTabs.value = []
      activeTab.value = 'main-product'
      selectedExistingProductId.value = null
      selectedExistingProductQuantity.value = 1
      tabFormRefs.value = {}
      formRef.value?.restoreValidation()
    }
  }
)
</script>

<style scoped></style>
