<template>
  <div
    class="flex items-center gap-2 text-sm min-w-[150px]"
    :class="ui?.loadingIndicator"
  >
    <div
      class="flex space-x-1"
      :class="ui?.loadingDots"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        :style="{ animationDelay: `${(i - 1) * 150}ms` }"
      />
    </div>
    <span class="text-gray-600 dark:text-gray-400">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
  ui?: {
    loadingIndicator?: string
    loadingDots?: string
  }
}

defineProps<Props>()
</script>
