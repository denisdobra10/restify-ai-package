# @doderasoftware/restify-ai

A fully customizable Vue 3 AI chatbot component library designed to work with [Laravel Restify](https://restify.binarcode.com/) backends.

## Features

- 🎨 **Fully Customizable** - Theming via CSS custom properties, configurable labels, slot-based component customization
- 🔌 **Laravel Restify Integration** - Built to work seamlessly with Laravel Restify AI endpoints
- 📡 **SSE Streaming** - Real-time streaming responses using Server-Sent Events
- 📎 **File Attachments** - Built-in support for file uploads
- 💬 **@Mentions** - Pluggable mention provider system for contextual references
- 💡 **Smart Suggestions** - Page-aware suggestion system with provider registration
- 🎯 **TypeScript** - Full TypeScript support with exported types
- 📦 **Tree-shakable** - Import only what you need

## Installation

```bash
npm install @doderasoftware/restify-ai
# or
pnpm add @doderasoftware/restify-ai
# or
yarn add @doderasoftware/restify-ai
```

### Peer Dependencies

Make sure you have these installed:

```bash
npm install vue@^3.4.0 pinia@^2.1.0
```

## Quick Start

### 1. Register the Plugin

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'

// Import base styles (optional, but recommended)
import '@doderasoftware/restify-ai/styles'

const app = createApp(App)

app.use(createPinia())
app.use(RestifyAiPlugin, {
  config: {
    apiEndpoint: '/api/ai/ask',
    quotaEndpoint: '/api/ai/quota',
    streamingEnabled: true,
  },
  theme: {
    primary: '#3b82f6',
  },
  labels: {
    aiName: 'AI Assistant',
  },
})

app.mount('#app')
```

### 2. Use Components

```vue
<template>
  <button @click="isOpen = true">Open AI Chat</button>
  
  <AiChatDrawer
    v-model:is-open="isOpen"
    :messages="messages"
    :is-loading="isLoading"
    :suggestions="suggestions"
    @send="handleSend"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AiChatDrawer, useRestifyAiStore } from '@doderasoftware/restify-ai'
import type { ChatMessage, AiSuggestion, Mention } from '@doderasoftware/restify-ai'

const isOpen = ref(false)
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)

const suggestions: AiSuggestion[] = [
  { id: '1', title: 'Show recent data', prompt: 'Show me recent data' },
]

const store = useRestifyAiStore()

async function handleSend(payload: { message: string; mentions: Mention[]; attachments: File[] }) {
  // Add user message
  messages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    message: payload.message,
    created_at: new Date().toISOString(),
  })

  // Call your API
  isLoading.value = true
  
  try {
    await store.askQuestion({
      message: payload.message,
      mentions: payload.mentions,
      attachments: payload.attachments,
      onMessage: (text) => {
        // Handle streaming response
        const lastMessage = messages.value[messages.value.length - 1]
        if (lastMessage?.role === 'assistant') {
          lastMessage.message = text
        } else {
          messages.value.push({
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            message: text,
            created_at: new Date().toISOString(),
          })
        }
      },
    })
  } finally {
    isLoading.value = false
  }
}
</script>
```

## Configuration

### Plugin Options

```typescript
interface RestifyAiPluginOptions {
  config?: Partial<RestifyAiConfig>
  theme?: Partial<RestifyAiTheme>
  labels?: Partial<RestifyAiLabels>
}
```

### Config Options

```typescript
interface RestifyAiConfig {
  // API endpoints
  apiEndpoint: string
  quotaEndpoint?: string
  
  // Streaming
  streamingEnabled?: boolean
  
  // Request customization
  headers?: Record<string, string>
  getAuthToken?: () => string | Promise<string>
  
  // Mention provider
  mentionProvider?: () => Promise<MentionItem[]>
  
  // Callbacks
  onError?: (error: Error) => void
  onQuotaExhausted?: () => void
}
```

### Theme Options

All theme values are applied as CSS custom properties:

```typescript
interface RestifyAiTheme {
  primary?: string
  primaryHover?: string
  primaryLight?: string
  bg?: string
  text?: string
  textMuted?: string
  borderColor?: string
  hoverBg?: string
  error?: string
  errorBg?: string
  success?: string
  warning?: string
  codeBg?: string
  assistantBg?: string
}
```

### Labels

All UI text is customizable:

```typescript
interface RestifyAiLabels {
  aiName?: string
  you?: string
  inputPlaceholder?: string
  sendMessage?: string
  attachFile?: string
  copyToClipboard?: string
  close?: string
  emptyStateTitle?: string
  emptyStateDescription?: string
  errorGeneric?: string
  errorNetwork?: string
  quotaRemaining?: string
}
```

## Components

### AiChatDrawer

The main chat drawer component.

```vue
<AiChatDrawer
  v-model:is-open="isOpen"
  title="AI Assistant"
  position="right"
  width="420px"
  :messages="messages"
  :is-loading="isLoading"
  :is-streaming="isStreaming"
  :suggestions="suggestions"
  :quota="quota"
  :close-on-backdrop="true"
  :close-on-esc="true"
  @send="handleSend"
  @suggestion-click="handleSuggestion"
  @copy="handleCopy"
>
  <!-- Custom slots -->
  <template #header>...</template>
  <template #empty>...</template>
  <template #message-avatar="{ message }">...</template>
  <template #input>...</template>
</AiChatDrawer>
```

### ChatMessage

Individual message component.

```vue
<ChatMessage
  :message="message"
  :is-streaming="false"
  :show-actions="true"
  @copy="handleCopy"
>
  <template #avatar>...</template>
  <template #actions="{ message }">...</template>
  <template #attachment="{ attachment }">...</template>
</ChatMessage>
```

### ChatInput

Message input component with file attachments and mentions.

```vue
<ChatInput
  v-model="message"
  placeholder="Ask anything..."
  :disabled="false"
  :show-attach-button="true"
  :show-quota="true"
  :quota="100"
  :accepted-file-types=".pdf,.doc,.txt"
  :max-file-size="10485760"
  :mention-provider="mentionProvider"
  @send="handleSend"
  @attach="handleAttach"
  @error="handleError"
/>
```

### AiEmptyState

Empty state with suggestions.

```vue
<AiEmptyState
  :suggestions="suggestions"
  @suggestion-click="handleClick"
>
  <template #icon>...</template>
  <template #title>How can I help?</template>
  <template #description>Ask me anything about your data.</template>
</AiEmptyState>
```

## Composables

### useRestifyAiStore

Pinia store for chat state management.

```typescript
const store = useRestifyAiStore()

// State
store.messages
store.isLoading
store.isStreaming
store.error
store.quota

// Actions
await store.askQuestion({ message, mentions, attachments, onMessage })
await store.fetchQuota()
store.clearMessages()
store.clearError()
```

### useMentionParsing

Parse @mentions from message text.

```typescript
const { extractMentions, parseAndCleanMessage, formatMentionsForApi } = useMentionParsing()

const mentions = extractMentions('@[John Doe](user:123) hello')
// [{ id: 'user:123', label: 'John Doe' }]

const clean = parseAndCleanMessage('@[John Doe](user:123) hello')
// 'John Doe hello'
```

### useChatMarkdown

Parse markdown content safely.

```typescript
const { parseMarkdown } = useChatMarkdown()

const html = parseMarkdown('**Hello** world')
// '<p><strong>Hello</strong> world</p>'
```

### useAiSuggestions

Get page-aware suggestions.

```typescript
const { suggestions, isLoading, refreshSuggestions } = useAiSuggestions()
```

## Suggestion Providers

Register page-specific suggestions:

```typescript
import { registerSuggestionProvider } from '@doderasoftware/restify-ai'

registerSuggestionProvider({
  id: 'orders',
  pathPattern: /^\/orders/,
  priority: 10,
  async getSuggestions(context) {
    return [
      { id: '1', title: 'Show recent orders', prompt: '...' },
      { id: '2', title: 'Order statistics', prompt: '...' },
    ]
  },
})
```

## Mention Providers

Implement custom mention providers:

```typescript
const mentionProvider = async (): Promise<MentionItem[]> => {
  const users = await fetchUsers()
  return users.map(user => ({
    id: `user:${user.id}`,
    label: user.name,
    type: 'user',
    meta: { avatar: user.avatar },
  }))
}

// Pass to config or component
<ChatInput :mention-provider="mentionProvider" />
```

## Styling

### CSS Custom Properties

Override any CSS variable:

```css
:root {
  --rai-primary: #6366f1;
  --rai-primary-hover: #4f46e5;
  --rai-bg: #ffffff;
  --rai-text: #1f2937;
  /* ... see styles/index.css for full list */
}
```

### Dark Mode

The library supports automatic dark mode via `prefers-color-scheme` or `.dark` class:

```css
.dark {
  --rai-bg: #1f2937;
  --rai-text: #f9fafb;
  /* ... */
}
```

### Tailwind CSS

Use the included preset for Tailwind integration:

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@doderasoftware/restify-ai/tailwind.preset.cjs')],
}
```

## Laravel Restify Backend

This package is designed to work with Laravel Restify. Here's a typical backend setup:

```php
// routes/api.php
Route::post('/ai/ask', [AiController::class, 'ask']);
Route::get('/ai/quota', [AiController::class, 'quota']);

// AiController.php
public function ask(Request $request)
{
    return response()->stream(function () use ($request) {
        // Your AI logic with SSE streaming
        foreach ($chunks as $chunk) {
            echo "data: " . json_encode(['text' => $chunk]) . "\n\n";
            ob_flush();
            flush();
        }
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
        'Connection' => 'keep-alive',
    ]);
}
```

## TypeScript

All types are exported:

```typescript
import type {
  ChatMessage,
  ChatAttachment,
  Mention,
  MentionItem,
  MentionProvider,
  AiSuggestion,
  SuggestionProvider,
  RestifyAiConfig,
  RestifyAiTheme,
  RestifyAiLabels,
} from '@doderasoftware/restify-ai'
```

## License

MIT © [Dodera Software](https://doderasoftware.com)
