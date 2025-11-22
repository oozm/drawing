<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <!-- 我的账户信息  可以编辑  github的 profile 信息 -->
  <div class="flex items-center justify-center">
    <img
      :src="user?.avatar"
      alt="avatar"
      class="w-24 h-24 rounded-full"
    >
    <div class="flex flex-col">
      <p>{{ user?.name }}</p>
    </div>
  </div>
  <!-- 我的账户信息 -->
</template>
