<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 max-w-sm w-full shadow-xl"
        :class="modalClass"
      >
        <!-- Icon for warning variant -->
        <div
          v-if="icon === 'warning'"
          class="flex items-center gap-3 mb-4"
        >
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
        </div>
        
        <!-- Standard title -->
        <h3
          v-else
          class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
        >
          {{ title }}
        </h3>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {{ message }}
        </p>
        
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            :class="ui?.cancelButton"
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            :class="confirmButtonClass"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AiChatDrawerUI } from '../../types'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  ui?: AiChatDrawerUI
  icon?: 'warning' | null
  confirmVariant?: 'danger' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  icon: null,
  confirmVariant: 'danger',
})

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const modalClass = computed(() => {
  if (props.icon === 'warning') {
    return props.ui?.historyLimitModal
  }
  return props.ui?.closeConfirmModal
})

const confirmButtonClass = computed(() => {
  const baseClass = props.confirmVariant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-primary-500 hover:bg-primary-600'
  
  const uiClass = props.confirmVariant === 'danger'
    ? props.ui?.closeConfirmButton
    : props.ui?.historyLimitButton
    
  return [baseClass, uiClass]
})
</script>
