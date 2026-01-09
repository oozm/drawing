<template>
  <UModal
    v-model:open="isOpen"
    title="What are you making?"
    :ui="{
      // 这里的 container 设置会覆盖默认的宽度
      content: ' sm:max-w-3xl flex  items-center justify-center sm:p-4',
    }"
  >
    <UButton
      label="change type"
      color="neutral"
      variant="ghost"
      icon="i-ph-list-bullets"
      class="w-[130px]"
    />
    <template #body>
      <div class="p-8 text-white">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            v-for="cat in categories"
            :key="cat.id"
            :class="[
              'flex flex-col items-center justify-center p-6 rounded-xl border cursor-pointer transition-all duration-200 aspect-square',
              selectedCategory === cat.id
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-gray-700 hover:border-gray-500 text-gray-400',
            ]"
            @click="selectedCategory = cat.id"
          >
            <UIcon
              :name="cat.icon"
              class="text-4xl mb-3"
            />
            <span class="text-sm font-medium">{{ cat.label }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-4 items-center pt-6">
          <div class="flex items-center gap-4">
            <span class="text-gray-400 text-sm font-medium">Technology</span>
            <div class="flex bg-gray-800 rounded-lg p-1">
              <div
                v-for="tech in ['CSS', 'Tailwind']"
                :key="tech"
                :class="[
                  'px-4 py-2 text-sm font-bold rounded-md cursor-pointer transition-all',
                  selectedTech === tech ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white',
                ]"
                @click="selectedTech = tech"
              >
                <div class="flex items-center gap-1">
                  <UIcon :name="tech === 'CSS' ? 'i-ph-file-css' : 'i-ph-wind'" />
                  {{ tech }}
                </div>
              </div>
            </div>
          </div>

          <UButton
            size="lg"
            color="primary"
            variant="solid"
            @click="handleContinue"
          >
            Continue
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
// 逻辑保留 (不作修改)
import { CATEGORIES } from '../../types/create'

const emit = defineEmits(['update:modelValue', 'select'])

const isOpen = ref(true)

const categories = CATEGORIES
const selectedCategory = ref('button')
const selectedTech = ref('CSS')

const handleContinue = () => {
  emit('select', { category: selectedCategory.value, tech: selectedTech.value })
  isOpen.value = false
}
</script>
