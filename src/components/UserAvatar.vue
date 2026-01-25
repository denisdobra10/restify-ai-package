<template>
  <div 
    class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
    :class="ui?.container"
  >
    <slot>
      <IconUser 
        class="w-5 h-5 text-gray-500 dark:text-gray-400"
        :class="ui?.icon"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { IconUser } from './icons'
import type { UserAvatarUI } from '../types'

interface Props {
  /** Custom UI classes for styling */
  ui?: UserAvatarUI
}

defineProps<Props>()
</script>
