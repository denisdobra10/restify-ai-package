<template>
  <div 
    class="w-6 h-6 min-w-[24px] flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600"
    :class="ui?.container"
  >
    <slot>
      <svg 
        class="w-4 h-4 text-gray-400 dark:text-gray-500" 
        :class="ui?.icon"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
        />
      </svg>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { AiAvatarUI } from '../types'

interface Props {
  /** Custom UI classes for styling */
  ui?: AiAvatarUI
}

defineProps<Props>()
</script>
