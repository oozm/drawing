<!-- BaseButton.vue -->
<template>
  <UButton
    v-bind="$attrs"
    class="
      base-button
      flex items-center justify-center
      cursor-pointer
      relative overflow-hidden
      px-6 py-2 rounded-full font-medium select-none
      transition-all duration-300
      backdrop-blur-xl backdrop-saturate-100

      bg-white/0
      border border-white/70
      text-slate-900
      shadow-[0_8px_22px_rgba(0,0,0,0.25)]

      hover:bg-white/30
      hover:border-white/60
      hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)]
      hover:-translate-y-0.5

      dark:bg-slate-800/40
      dark:border-white/10
      dark:text-slate-100
      dark:shadow-[0_10px_32px_rgba(0,0,0,0.85)]

      dark:hover:bg-slate-800/60
      dark:hover:border-white/20
      dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.95)]
    "
  >
    <div
      class="pointer-events-none absolute inset-0
      bg-gradient-to-b from-white/60 to-transparent
      dark:from-white/10
      transition-opacity duration-200"
    />

    <div
      class="pointer-events-none absolute inset-0
      bg-gradient-to-t from-white/10 to-transparent
      dark:from-white/5
      transition-opacity duration-200"
    />

    <slot />
  </UButton>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* ========= 弹跳手感：先大 → 再小 → 回到1 ========= */
@keyframes press-bounce {
  0%   { transform: scale(1); }
  25%  { transform: scale(1.05); }
  55%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.base-button:active {
  animation: press-bounce 500ms ease-out;
}

/* focus ring（键盘） */
.base-button:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.8),
    0 0 0 3px rgba(59,130,246,0.6),
    0 10px 30px rgba(0,0,0,0.4);
}

:global(.dark) .base-button:focus-visible {
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.5),
    0 0 0 3px rgba(59,130,246,0.4),
    0 12px 36px rgba(0,0,0,0.95);
}
</style>
