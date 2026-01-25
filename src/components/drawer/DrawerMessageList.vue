<template>
  <div class="max-w-3xl mx-auto px-4 space-y-6">
    <!-- Assistant Badge -->
    <div class="flex justify-center">
      <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        <IconSparkles class="w-4 h-4" />
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
        <IconSupport class="w-5 h-5" />
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
          <IconClock
            v-if="error.rateLimited"
            class="w-4 h-4 text-amber-600 dark:text-amber-400"
          />
          <IconWarning
            v-else
            class="w-4 h-4 text-red-600 dark:text-red-400"
          />
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
          <IconRefresh class="w-4 h-4" />
          {{ t('retry') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLabel } from '../../config'
import ChatMessage from '../ChatMessage.vue'
import { IconSparkles, IconSupport, IconClock, IconWarning, IconRefresh } from '../icons'
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
