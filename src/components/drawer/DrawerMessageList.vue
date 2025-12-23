<template>
  <div class="max-w-3xl mx-auto px-4 space-y-6">
    <!-- Assistant Badge -->
    <div class="flex justify-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        <svg
          class="w-4 h-4"
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
        <span>{{ t('title') || getLabel('aiName') }}</span>
      </div>
    </div>

    <!-- Messages -->
    <template
      v-for="(message, index) in messages"
      :key="message.id || index"
    >
      <slot 
        name="message" 
        :message="message" 
        :is-user="message.role === 'user'" 
        :is-loading="message.loading" 
        :is-streaming="message.streaming"
      >
        <ChatMessage
          :message="message"
          :loading-text="loadingMessage"
          @copy="$emit('copy', $event)"
        />
      </slot>
    </template>

    <!-- Contact Support Button -->
    <div
      v-if="quota.remaining === 0"
      class="flex justify-center"
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-sm"
        @click="$emit('contact-support')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span>{{ getLabel('contactSupport') }}</span>
      </button>
    </div>

    <!-- Error Message -->
    <div 
      v-if="error.message" 
      class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 px-2 py-1 pb-6"
      :class="ui?.errorContainer"
    >
      <span :class="ui?.errorMessage">{{ error.message }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 font-medium"
        :class="ui?.retryButton"
        :title="t('retry')"
        @click="$emit('retry')"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLabel } from '../../config'
import ChatMessage from '../ChatMessage.vue'
import type { ChatMessage as ChatMessageType, ChatQuota, ChatError, AiChatDrawerUI, AiChatDrawerTexts } from '../../types'

interface Props {
  messages: ChatMessageType[]
  loadingMessage: string
  quota: ChatQuota
  error: ChatError
  ui?: AiChatDrawerUI
  t: (key: keyof AiChatDrawerTexts, params?: Record<string, any>) => string
}

defineProps<Props>()

defineEmits<{
  (e: 'copy', message: any): void
  (e: 'contact-support'): void
  (e: 'retry'): void
}>()
</script>
