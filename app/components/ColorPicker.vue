<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: 'Color',
  },
  default: {
    type: String,
    default: '#030712',
  },
  icon: {
    type: String,
    default: 'i-ph-pencil',
  },
})

const emit = defineEmits(['update:modelValue', 'color'])

// Tailwind CSS 500 colors hexadecimal values
const colors = ['#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185']
const grayColors = ['#030712', '#1f2937', '#4b5563', '#9ca3af', '#e5e7eb', '#f9fafb']

const current = ref(props.modelValue || props.default)

watch(() => props.modelValue, (val) => {
  if (val) current.value = val
})

function setColor(hex: string) {
  current.value = hex
  emit('update:modelValue', hex)
  emit('color', hex)
}
</script>

<template>
  <UPopover
    mode="click"
    :ui="{ content: 'w-[156px]' }"
  >
    <template #default="{ open }">
      <slot name="trigger" :open="open" :color="current">
        <UButton
          color="neutral"
          variant="ghost"
          square
          :class="[open && 'bg-(--ui-bg-muted)']"
          aria-label="Color picker"
          :icon="icon"
        >
          <div
            class="w-5 h-5 rounded-full"
            :style="{ backgroundColor: current }"
          />
        </UButton>
      </slot>
    </template>

    <template #content>
      <div class="p-2">
        <div class="grid grid-cols-6 gap-px">
          <button
            v-for="color in colors"
            :key="color"
            class="w-5 h-5 rounded-full border-2 hover:border-neutral-200 cursor-pointer"
            :class="color === current ? 'border-neutral-200' : 'border-white'"
            :style="{ backgroundColor: color }"
            @click="setColor(color)"
          />
        </div>

        <hr class="border-(--ui-border-muted) my-2">

        <div class="grid grid-cols-6 gap-px">
          <button
            v-for="color in grayColors"
            :key="color"
            class="w-5 h-5 rounded-full border-2 hover:border-neutral-200 cursor-pointer"
            :class="color === current ? 'border-neutral-200' : 'border-white'"
            :style="{ backgroundColor: color }"
            @click="setColor(color)"
          />
        </div>
        
        <hr class="border-(--ui-border-muted) my-2">
        
        <!-- Custom Color Input -->
        <div class="flex items-center gap-2">
           <div class="text-xs text-gray-500">Custom</div>
           <input 
             type="color" 
             :value="current"
             class="flex-1 h-6 cursor-pointer bg-transparent border-0 p-0"
             @input="setColor(($event.target as HTMLInputElement).value)"
           />
        </div>
      </div>
    </template>
  </UPopover>
</template>
