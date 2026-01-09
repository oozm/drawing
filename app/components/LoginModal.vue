<template>
  <!-- 使用 UModal 组件来处理模态框的显示和背景/关闭逻辑 -->
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'flex items-center justify-center text-center',
      overlay: 'bg-gray-900/80 backdrop-blur-sm',
      title: 'hidden',
      description: 'hidden',
      close: 'absolute top-4 right-4 z-10 text-gray-400 hover:text-white',
    }"
  >
    <!-- 方便测试的按钮 -->
    <UButton
      v-if="!loggedIn"
      label="Join the Community"
      color="neutral"
      variant="ghost"
      icon="i-lucide-rocket"
    />
    <template #body>
      <div class="space-y-6">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="relative w-20 h-20">
            <div class="flex items-center justify-center w-full h-full bg-indigo-500 rounded-full border-4 border-indigo-400/50 shadow-lg">
              <UIcon
                name="i-heroicons-sparkles-20-solid"
                class="w-10 h-10 text-white"
              />
            </div>
          </div>

          <h2 class="text-2xl font-bold text-white tracking-tight">
            Join the Community
          </h2>
          <p class="text-sm text-gray-400 max-w-xs">
            Create beautiful UI elements and share them with 100,000+ developers
          </p>
        </div>

        <ul class="space-y-3 pb-6 border-b border-gray-800/50">
          <li class="flex items-start text-sm text-gray-300">
            <UIcon
              name="i-heroicons-check-circle-20-solid"
              class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 mr-2"
            />
            <span>Create and share unlimited UI elements</span>
          </li>
          <li class="flex items-start text-sm text-gray-300">
            <UIcon
              name="i-heroicons-check-circle-20-solid"
              class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 mr-2"
            />
            <span>Get inspiration from thousands of designs</span>
          </li>
          <li class="flex items-start text-sm text-gray-300">
            <UIcon
              name="i-heroicons-check-circle-20-solid"
              class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 mr-2"
            />
            <span>Join a thriving community of creators</span>
          </li>
        </ul>

        <!-- Auth Buttons -->
        <div class="space-y-3">
          <!-- GitHub Button (Primary/Default) -->
          <UButton
            v-if="authProviders.github"
            to="/auth/github"
            icon="i-simple-icons-github"
            label="Continue with GitHub"
            external
            block
            size="lg"
            color="neutral"
            variant="solid"
            :ui="{
              base: 'rounded-lg',
              label: 'font-semibold',
            }"
            @click="console.log('GitHub login')"
          />
          <UButton
            v-if="authProviders.google"
            to="/auth/google"
            icon="i-simple-icons-google"
            label="Continue with Google"
            block
            size="lg"
            color="neutral"
            variant="solid"
            :ui="{
              base: 'rounded-lg',
              label: 'font-semibold',
            }"
            @click="console.log('Google login')"
          />
          <UButton
            v-if="!authProviders.github && !authProviders.google"
            to="/auth/anonymous"
            label="Sign-in anonymously"
            icon="i-ph-mask-happy-duotone"
            color="neutral"
            size="lg"
            external
            block
          />
        </div>

        <!-- Footer Links and Terms -->
        <div class="text-center text-xs space-y-2 pt-2">
          <p class="text-gray-500">
            By continuing, you agree to our
            <ULink
              to="#"
              class="text-blue-500 hover:text-blue-400 ml-1"
            >Terms</ULink>
            and
            <ULink
              to="#"
              class="text-blue-500 hover:text-blue-400 ml-1"
            >Privacy Policy</ULink>
          </p>
          <p class="text-gray-500 pt-2">
            Already have an account?
            <ULink
              to="#"
              class="text-blue-500 hover:text-blue-400 font-semibold ml-1"
            >Sign in</ULink>
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
console.log('loggedIn', loggedIn.value)

const authProviders = useState<{ google: boolean, github: boolean }>('authProviders')

// 使用 ref 来控制模态框的显示状态
// const isOpen = ref(false) // 默认设置为 true 方便在组件加载时看到效果

// // 如果要在父组件中控制此模态框，可以定义 props 和 emits，例如：
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<style scoped>
/* Nuxt UI 通常不需要写 scoped CSS，因为它使用 Tailwind CSS。
  这里保留，以防万一需要自定义样式。
*/
</style>
