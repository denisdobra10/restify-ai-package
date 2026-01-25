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
      class="rounded-lg p-4 mb-4"
      :class="[
        ui?.errorContainer,
        error.rateLimited 
          ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' 
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      ]"
    >
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div 
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          :class="error.rateLimited ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-red-100 dark:bg-red-900/40'"
        >
          <svg
            v-if="error.rateLimited"
            class="w-4 h-4 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p 
            class="text-sm font-medium"
            :class="[
              ui?.errorMessage,
              error.rateLimited 
                ? 'text-amber-800 dark:text-amber-200' 
                : 'text-red-800 dark:text-red-200'
            ]"
          >
            {{ error.message }}
          </p>
          <p 
            v-if="error.rateLimited"
            class="text-xs text-amber-600 dark:text-amber-400 mt-1"
          >
            {{ t('retryHint') || 'Please wait a moment before trying again.' }}
          </p>
        </div>
        
        <!-- Retry Button -->
        <button
          type="button"
          class="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="[
            ui?.retryButton,
            error.rateLimited 
              ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/60' 
              : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60'
          ]"
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
          {{ t('retry') }}
        </button>
      </div>
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
