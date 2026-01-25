<template>
  <svg 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    :stroke-width="strokeWidth"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  strokeWidth?: number | string
}

withDefaults(defineProps<Props>(), {
  strokeWidth: 1.5,
})

defineOptions({
  inheritAttrs: true,
})
</script>
