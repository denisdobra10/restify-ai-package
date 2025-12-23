<template>
  <div 
    class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
    :class="ui?.container"
  >
    <slot>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        class="w-5 h-5 text-gray-500 dark:text-gray-400"
        :class="ui?.icon"
      >
        <path
          fill-rule="evenodd"
          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
          clip-rule="evenodd"
        />
      </svg>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { UserAvatarUI } from '../types'

interface Props {
  /** Custom UI classes for styling */
  ui?: UserAvatarUI
}

defineProps<Props>()
</script>
