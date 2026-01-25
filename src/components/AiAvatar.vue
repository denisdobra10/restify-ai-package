<template>
  <div 
    class="w-8 h-8 min-w-[32px] flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
    :class="ui?.container"
  >
    <slot>
      <IconSparkles 
        class="w-4 h-4 text-gray-500 dark:text-gray-400" 
        :class="ui?.icon"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { IconSparkles } from './icons'
import type { AiAvatarUI } from '../types'

interface Props {
  /** Custom UI classes for styling */
  ui?: AiAvatarUI
}

defineProps<Props>()
</script>
