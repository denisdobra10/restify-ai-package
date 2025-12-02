<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Restify AI Playground</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Testing ground for @doderasoftware/restify-ai package</p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chat Drawer Demo</h2>
        <button
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          @click="toggleDrawer"
        >
          {{ isDrawerOpen ? 'Close' : 'Open' }} AI Chat
        </button>
      </div>

      <div class="grid gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">AI Avatar</h3>
          <AiAvatar />
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Chat Message (User)</h3>
          <ChatMessage
            :message="{
              id: '1',
              role: 'user',
              message: 'Hello! Can you help me with my data?',
              created_at: new Date().toISOString(),
            }"
          />
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Chat Message (Assistant)</h3>
          <ChatMessage
            :message="{
              id: '2',
              role: 'assistant',
              message: 'Of course! I can help you analyze your data. Here are some things I can do:\n\n- **Query your database**\n- Generate reports\n- Answer questions\n\n```javascript\nconst result = await api.query(\'SELECT * FROM users\');\n```',
              created_at: new Date().toISOString(),
            }"
          />
        </div>
      </div>
    </main>

    <!-- AI Chat Drawer -->
    <AiChatDrawer v-model="isDrawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  AiAvatar,
  ChatMessage,
  AiChatDrawer,
} from '@doderasoftware/restify-ai'

const isDrawerOpen = ref(false)

function toggleDrawer(): void {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>
