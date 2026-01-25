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
      d="M6 18L18 6M6 6l12 12"
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
