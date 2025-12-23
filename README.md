<div align="center">
  <h1>🤖 Restify AI</h1>
  <p><strong>Professional AI Chatbot Component for Vue 3 + Laravel Restify</strong></p>
  <p>Build intelligent, context-aware AI assistants that integrate seamlessly with your Laravel backend</p>

  <a href="https://www.npmjs.com/package/@doderasoftware/restify-ai"><img src="https://img.shields.io/npm/v/@doderasoftware/restify-ai.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@doderasoftware/restify-ai"><img src="https://img.shields.io/npm/dm/@doderasoftware/restify-ai.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.x-brightgreen.svg?style=flat-square" alt="Vue 3"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg?style=flat-square" alt="TailwindCSS"></a>

  <br /><br />

  <a href="https://laravel-restify.com">Laravel Restify</a> •
  <a href="https://binarcode.com">BinarCode</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#configuration">Configuration</a>
</div>

---

## Overview

**Restify AI** is a production-ready Vue 3 component library that provides a fully-featured AI chatbot interface designed to work seamlessly with [Laravel Restify](https://laravel-restify.com) backends. Built by [BinarCode](https://binarcode.com), the team behind Laravel Restify, this package enables you to add powerful AI capabilities to your Vue.js applications in minutes.

Whether you are building a customer support system, an intelligent assistant for your SaaS application, or an AI-powered admin panel, Restify AI provides all the building blocks you need.

## Features

### 🎯 Core Features
- **Real-time SSE Streaming** - Smooth, character-by-character response streaming
- **File Attachments** - Upload and process documents, images, and more
- **@Mentions System** - Reference entities from your application (users, documents, etc.)
- **Context-Aware Suggestions** - Smart prompts based on current page/route
- **Chat History** - Persistent conversation memory with configurable limits
- **Markdown Rendering** - Beautiful formatting with syntax highlighting
- **Quota Management** - Track and display API usage limits

### 🎨 UI/UX
- **Fully Customizable** - Override any style with Tailwind CSS classes
- **Dark Mode Support** - Automatic dark/light theme detection
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Quick access with configurable shortcuts (Cmd/Ctrl+G)
- **Fullscreen Mode** - Expandable chat interface
- **Animations** - Smooth transitions and loading states
- **Customizable Avatars** - Use custom components or images

### 🔧 Developer Experience
- **TypeScript First** - Full type definitions included
- **Vue 3 Composition API** - Modern Vue patterns
- **Pinia Integration** - State management built-in
- **Slot-Based Customization** - Override any component section
- **Lifecycle Hooks** - Tap into every stage of the chat flow
- **i18n Ready** - Full internationalization support

### 🔒 Enterprise Ready
- **Support Mode** - Route conversations to human agents
- **Permission System** - Control features based on user permissions
- **Request/Response Interceptors** - Customize API communication
- **Retry Logic** - Automatic retry with configurable backoff
- **Error Handling** - User-friendly error messages

## Installation

```bash
# npm
npm install @doderasoftware/restify-ai

# yarn
yarn add @doderasoftware/restify-ai

# pnpm
pnpm add @doderasoftware/restify-ai
```

### Peer Dependencies

```bash
npm install vue@^3.3.0 pinia@^2.1.0 tailwindcss@^3.3.0
```

## Quick Start

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

## Configuration

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

  // PROVIDERS
  mentionProviders: [{
    type: "user",
    label: "Users",
    search: async (q) => api.searchUsers(q),
  }],
  suggestionProviders: [{
    id: "invoices",
    routes: ["/invoices/*"],
    getSuggestions: (ctx) => [{ id: "1", title: "Create Invoice", prompt: "Help me create an invoice" }],
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

  // CUSTOM COMPONENTS
  assistantAvatar: CustomAvatarComponent,
  userAvatar: () => currentUser.value?.avatarUrl,

  // CALLBACKS
  onMessageSent: (msg) => analytics.track("ai_sent"),
  onError: (err) => Sentry.captureException(err),
  onStreamStart: () => console.log("Stream started"),
  beforeSend: (payload) => ({ ...payload, timestamp: Date.now() }),
})
```

## Component API

### AiChatDrawer Props

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

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Drawer state changed |
| `close` | - | Drawer closed |
| `contact-support` | - | Support mode activated |
| `new-chat` | - | New chat started |

### Slots

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

## UI Customization

Every component accepts a `ui` prop for CSS class customization:

```vue
<AiChatDrawer
  v-model="isOpen"
  :ui="{
    backdrop: "bg-black/50 backdrop-blur-sm",
    drawer: "shadow-2xl",
    panel: "bg-gray-50 dark:bg-gray-900",
    header: "border-b-2 border-blue-500",
    newChatButton: "bg-gradient-to-r from-blue-500 to-purple-500",
  }"
/>
```

### Available UI Interfaces

```typescript
interface AiChatDrawerUI {
  backdrop?: string
  drawer?: string
  panel?: string
  header?: string
  headerTitle?: string
  body?: string
  footer?: string
  newChatButton?: string
  errorContainer?: string
  retryButton?: string
}

interface ChatInputUI {
  root?: string
  textarea?: string
  sendButton?: string
  attachButton?: string
  suggestionsDropdown?: string
}

interface ChatMessageUI {
  root?: string
  userBubble?: string
  assistantBubble?: string
  content?: string
  loadingDots?: string
}
```

## Store API

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

## Composables

### useAiDrawerShortcut

```typescript
import { useAiDrawerShortcut } from "@doderasoftware/restify-ai"

// Uses store directly (recommended)
useAiDrawerShortcut()

// Or pass a ref
const drawerRef = ref(false)
useAiDrawerShortcut(drawerRef)
```

### usePageAiContext

```typescript
import { usePageAiContext } from "@doderasoftware/restify-ai"

usePageAiContext({
  pageType: "invoice-detail",
  entityId: route.params.id,
  entityType: "invoice",
  metadata: { customerName: invoice.value?.customer?.name },
})
```

## Backend Integration

### Laravel Restify Setup

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
{ id: string, name: string, url: string, type: string, size: number }
```

**Quota Endpoint:**

```typescript
{ limit: number, used: number, remaining: number }
```

## TypeScript Support

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

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) - [BinarCode](https://binarcode.com)

---

<div align="center">
  <p><strong>Built with love by <a href="https://binarcode.com">BinarCode</a></strong></p>
  <p>
    <a href="https://laravel-restify.com">Laravel Restify</a> |
    <a href="https://github.com/BinarCode/laravel-restify">GitHub</a> |
    <a href="https://binarcode.com">Website</a>
  </p>
  <p><sub>Published by <a href="https://doderasoft.com">Dodera Software</a></sub></p>
</div>

## Store API

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

## Composables

### useAiDrawerShortcut

```typescript
import { useAiDrawerShortcut } from "@doderasoftware/restify-ai"

// Uses store directly (recommended)
useAiDrawerShortcut()

// Or pass a ref
const drawerRef = ref(false)
useAiDrawerShortcut(drawerRef)
```

### usePageAiContext

```typescript
import { usePageAiContext } from "@doderasoftware/restify-ai"

usePageAiContext({
  pageType: "invoice-detail",
  entityId: route.params.id,
  entityType: "invoice",
  metadata: { customerName: invoice.value?.customer?.name },
})
```

## Backend Integration

### Laravel Restify Setup

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
{ id: string, name: string, url: string, type: string, size: number }
```

**Quota Endpoint:**

```typescript
{ limit: number, used: number, remaining: number }
```

## TypeScript Support

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

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) - [BinarCode](https://binarcode.com)

---

<div align="center">
  <p><strong>Built with love by <a href="https://binarcode.com">BinarCode</a></strong></p>
  <p>
    <a href="https://laravel-restify.com">Laravel Restify</a> |
    <a href="https://github.com/BinarCode/laravel-restify">GitHub</a> |
    <a href="https://binarcode.com">Website</a>
  </p>
  <p><sub>Published by <a href="https://doderasoft.com">Dodera Software</a></sub></p>
</div>
