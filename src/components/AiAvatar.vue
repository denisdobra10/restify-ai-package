<template>
  <div 
    class="w-6 h-6 min-w-[24px] flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600"
    :class="ui?.container"
  >
    <slot>
      <IconSparkles 
        class="w-4 h-4 text-gray-400 dark:text-gray-500" 
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
