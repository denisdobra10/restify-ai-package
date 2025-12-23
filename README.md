# @doderasoftware/restify-ai

A production-ready AI chatbot component for Vue 3 with real-time SSE streaming, file attachments, @mentions, and seamless Laravel Restify integration.

[![npm version](https://img.shields.io/npm/v/@doderasoftware/restify-ai.svg)](https://www.npmjs.com/package/@doderasoftware/restify-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)

**📖 [Laravel Restify](https://laravel-restify.com) | 📦 [npm](https://www.npmjs.com/package/@doderasoftware/restify-ai) | 🏢 [BinarCode](https://binarcode.com)**

## ✨ Features

- 🌊 **Real-time SSE Streaming** - Smooth character-by-character response streaming
- 📎 **File Attachments** - Upload and process documents, images, and more
- 👥 **@Mentions System** - Reference entities from your application (users, documents, etc.)
- 💡 **Context-Aware Suggestions** - Smart prompts based on current page/route
- 💬 **Chat History** - Persistent conversation memory with configurable limits
- 📝 **Markdown Rendering** - Beautiful formatting with syntax highlighting
- 📊 **Quota Management** - Track and display API usage limits
- 🎨 **Fully Customizable** - Override any style with Tailwind CSS classes
- 🌙 **Dark Mode Support** - Automatic dark/light theme detection
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** - Quick access with configurable shortcuts (Cmd/Ctrl+G)
- 🔳 **Fullscreen Mode** - Expandable chat interface
- 🎯 **TypeScript First** - Full type definitions included
- 🗃️ **Pinia Integration** - State management built-in
- 🔧 **Slot-Based Customization** - Override any component section
- 🌐 **i18n Ready** - Full internationalization support
- 🆘 **Support Mode** - Route conversations to human agents
- 🔄 **Retry Logic** - Automatic retry with configurable backoff
- ⚠️ **Error Handling** - User-friendly error messages

## 📦 Installation

```bash
npm install @doderasoftware/restify-ai
```

### Peer Dependencies

```bash
npm install vue@^3.3.0 pinia@^2.1.0 tailwindcss@^3.3.0
```

## 🚀 Quick Start

### 1. Configure Tailwind CSS

```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@doderasoftware/restify-ai/dist/**/*.{js,vue}",
  ],
  presets: [
    require("@doderasoftware/restify-ai/tailwind"),
  ],
}
```

### 2. Import Styles

```typescript
// main.ts
import "@doderasoftware/restify-ai/styles"
```

### 3. Register the Plugin

```typescript
// plugins/restifyAi.ts
import { RestifyAiPlugin } from "@doderasoftware/restify-ai"
import type { App } from "vue"

export function setupRestifyAi(app: App) {
  app.use(RestifyAiPlugin, {
    endpoints: {
      ask: "/api/ai/ask",
      uploadFile: "/api/ai/upload",
      quota: "/api/ai/quota",
    },
    getAuthToken: () => localStorage.getItem("token"),
    baseUrl: import.meta.env.VITE_API_URL,
  })
}
```

```typescript
// main.ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import { setupRestifyAi } from "./plugins/restifyAi"
import "@doderasoftware/restify-ai/styles"

const app = createApp(App)
app.use(createPinia())
setupRestifyAi(app)
app.mount("#app")
```

### 4. Add the Component

```vue
<template>
  <div>
    <button @click="showChat = true" class="fixed bottom-4 right-4 p-3 bg-blue-600 rounded-full">
      <SparklesIcon class="w-6 h-6 text-white" />
    </button>
    <AiChatDrawer v-model="showChat" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { AiChatDrawer } from "@doderasoftware/restify-ai"

const showChat = ref(false)
</script>
```

### 5. Enable Keyboard Shortcut

```typescript
import { useAiDrawerShortcut } from "@doderasoftware/restify-ai"

// Enable Cmd/Ctrl+G to toggle drawer
useAiDrawerShortcut()
```

## ⚙️ Configuration

### Full Configuration Options

```typescript
app.use(RestifyAiPlugin, {
  // REQUIRED
  endpoints: {
    ask: "/api/ai/ask",
    uploadFile: "/api/ai/upload",
    quota: "/api/ai/quota",
  },
  getAuthToken: () => localStorage.getItem("auth_token"),

  // API CONFIGURATION
  baseUrl: "https://api.example.com",
  getCustomHeaders: () => ({ "X-Tenant-ID": getTenantId() }),
  buildRequest: (payload) => ({ ...payload, custom: "value" }),
  parseStreamContent: (data) => JSON.parse(data).choices?.[0]?.delta?.content,

  // RETRY
  retry: { maxRetries: 3, retryDelay: 1000 },

  // INTERNATIONALIZATION
  translate: (key, params) => i18n.t("ai." + key, params),
  labels: {
    title: "AI Assistant",
    placeholder: "Ask me anything...",
    loadingText: "Thinking...",
  },

  // MENTION PROVIDERS
  mentionProviders: [{
    type: "user",
    label: "Users",
    search: async (query) => api.searchUsers(query),
  }],

  // SUGGESTION PROVIDERS
  suggestionProviders: [{
    id: "invoices",
    routes: ["/invoices/*"],
    getSuggestions: (ctx) => [
      { id: "1", title: "Create Invoice", prompt: "Help me create an invoice" }
    ],
  }],

  // THEMING
  theme: {
    primaryColor: "#3b82f6",
    userBubbleColor: "#3b82f6",
    drawerWidth: "500px",
  },

  // LIMITS
  chatHistoryLimit: 50,
  maxAttachments: 5,
  maxFileSize: 10 * 1024 * 1024,

  // FEATURES
  keyboardShortcut: "cmd+g",
  enableSupportMode: true,

  // CUSTOM AVATARS
  assistantAvatar: CustomAvatarComponent,
  userAvatar: () => currentUser.value?.avatarUrl,

  // CALLBACKS
  onMessageSent: (msg) => analytics.track("ai_sent"),
  onError: (err) => Sentry.captureException(err),
  onStreamStart: () => console.log("Stream started"),
  beforeSend: (payload) => ({ ...payload, timestamp: Date.now() }),
})
```

## 🎨 UI Customization

The `:ui` prop allows complete control over every element's styling:

```vue
<AiChatDrawer
  v-model="isOpen"
  :ui="{
    backdrop: 'bg-black/50 backdrop-blur-sm',
    drawer: 'shadow-2xl',
    panel: 'bg-gray-50 dark:bg-gray-900',
    header: 'border-b-2 border-blue-500',
    newChatButton: 'bg-gradient-to-r from-blue-500 to-purple-500',
  }"
/>
```

### Available UI Keys - AiChatDrawer

| Key | Description |
|-----|-------------|
| `backdrop` | Backdrop overlay |
| `drawer` | Drawer container |
| `panel` | Inner panel |
| `header` | Header container |
| `headerTitle` | Header title text |
| `body` | Chat body area |
| `footer` | Footer container |
| `newChatButton` | New chat button |
| `errorContainer` | Error message container |
| `retryButton` | Retry button |

### Available UI Keys - ChatInput

| Key | Description |
|-----|-------------|
| `root` | Input root container |
| `textarea` | Textarea element |
| `sendButton` | Send button |
| `attachButton` | Attachment button |
| `suggestionsDropdown` | Suggestions dropdown |

### Available UI Keys - ChatMessage

| Key | Description |
|-----|-------------|
| `root` | Message root container |
| `userBubble` | User message bubble |
| `assistantBubble` | Assistant message bubble |
| `content` | Message content |
| `loadingDots` | Loading animation dots |

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | required | Controls drawer visibility (v-model) |
| `width` | `string` | `"600px"` | Drawer width |
| `fullscreenWidth` | `string` | `"90vw"` | Width when fullscreen |
| `topOffset` | `string` | `"0"` | Top offset (for fixed headers) |
| `position` | `"left" \| "right"` | `"right"` | Drawer position |
| `showBackdrop` | `boolean` | `false` | Show backdrop overlay |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `showQuota` | `boolean` | `true` | Show quota display |
| `confirmClose` | `boolean` | `true` | Confirm before clearing |
| `ui` | `AiChatDrawerUI` | `{}` | Custom CSS classes |
| `texts` | `AiChatDrawerTexts` | `{}` | Custom text labels |

## 📡 Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Drawer state changed |
| `close` | - | Drawer closed |
| `contact-support` | - | Support mode activated |
| `new-chat` | - | New chat started |

## 🎰 Slots

| Slot | Props | Description |
|------|-------|-------------|
| `header` | `{ quota, isFullscreen, onNewChat, onClose }` | Custom header |
| `empty-state` | `{ suggestions, onClick }` | Custom empty state |
| `message` | `{ message, isUser, isLoading }` | Custom message bubble |
| `input` | `{ modelValue, sending, onSubmit }` | Custom input area |

```vue
<AiChatDrawer v-model="isOpen">
  <template #header="{ quota, isFullscreen, onNewChat, onClose }">
    <MyCustomHeader />
  </template>
  <template #empty-state="{ suggestions, onClick }">
    <MyCustomEmptyState />
  </template>
  <template #message="{ message, isUser, isLoading }">
    <MyCustomMessage />
  </template>
  <template #input="{ modelValue, sending, onSubmit }">
    <MyCustomInput />
  </template>
</AiChatDrawer>
```

## 🏪 Store API

Access the Pinia store for advanced use cases:

```typescript
import { useRestifyAiStore } from "@doderasoftware/restify-ai"

const store = useRestifyAiStore()

// State
store.chatHistory          // ChatMessage[]
store.loading              // boolean
store.sending              // boolean
store.quota                // { limit, used, remaining }
store.error                // { message, failedQuestion, timestamp }

// Actions
store.toggleChat()
store.sendMessage(payload)
store.cancelRequest()
store.retryLastMessage()
store.clearChatHistory()
store.fetchQuota()
store.uploadFile(file)
```

## 🪝 Composables

### useAiDrawerShortcut

Enable keyboard shortcuts to toggle the chat drawer:

```typescript
import { useAiDrawerShortcut } from "@doderasoftware/restify-ai"

// Uses store directly (recommended)
useAiDrawerShortcut()

// Or pass a ref
const drawerRef = ref(false)
useAiDrawerShortcut(drawerRef)
```

### usePageAiContext

Provide page context to the AI for smarter responses:

```typescript
import { usePageAiContext } from "@doderasoftware/restify-ai"

usePageAiContext({
  pageType: "invoice-detail",
  entityId: route.params.id,
  entityType: "invoice",
  metadata: { customerName: invoice.value?.customer?.name },
})
```

## 🔌 Backend Integration

This package is designed to work with [Laravel Restify](https://laravel-restify.com):

```php
// routes/api.php
Route::middleware("auth:sanctum")->group(function () {
    Route::post("/ai/ask", [AiController::class, "ask"]);
    Route::post("/ai/upload", [AiController::class, "upload"]);
    Route::get("/ai/quota", [AiController::class, "quota"]);
});
```

### Expected Request/Response Formats

**Ask Endpoint (SSE Stream):**

```typescript
// Request
{
  question: string
  history: Array<{ role: string, message: string }>
  stream: true
  files?: Array<{ id: string, name: string }>
  mentions?: Array<{ id: string, type: string, name: string }>
}

// Response: Server-Sent Events (OpenAI format)
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" world"}}]}
data: [DONE]
```

**Upload Endpoint:**

```typescript
// Response
{ id: string, name: string, url: string, type: string, size: number }
```

**Quota Endpoint:**

```typescript
// Response
{ limit: number, used: number, remaining: number }
```

## 📐 TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  ChatMessage,
  ChatAttachment,
  Mention,
  ChatQuota,
  RestifyAiConfig,
  MentionProvider,
  SuggestionProvider,
  AISuggestion,
  AiChatDrawerUI,
  AiChatDrawerTexts,
} from "@doderasoftware/restify-ai"
```

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔗 Links

- [📖 Laravel Restify Documentation](https://laravel-restify.com)
- [📦 npm Package](https://www.npmjs.com/package/@doderasoftware/restify-ai)
- [🏢 BinarCode](https://binarcode.com)

## 📄 License

MIT © [BinarCode](https://binarcode.com)

---

Built with ❤️ by [BinarCode](https://binarcode.com) · Published by [Dodera Software](https://doderasoft.com)
