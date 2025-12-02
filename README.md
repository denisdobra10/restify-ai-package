# @doderasoftware/restify-ai

> 🤖 A fully customizable Vue 3 AI chatbot component library with Laravel Restify integration

[![npm version](https://img.shields.io/npm/v/@doderasoftware/restify-ai)](https://www.npmjs.com/package/@doderasoftware/restify-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔌 **Laravel Restify** | Built for seamless Laravel Restify AI endpoints |
| 📡 **SSE Streaming** | Real-time streaming responses with Server-Sent Events |
| 📎 **File Attachments** | Built-in file upload with progress & preview |
| 💬 **@Mentions** | Pluggable mention providers (employees, projects, etc.) |
| 💡 **Smart Suggestions** | Route-aware suggestion system |
| 🎨 **Fully Customizable** | UI classes, texts, slots, themes |
| ⌨️ **Keyboard Shortcuts** | Configurable shortcuts (e.g., \`Cmd+G\`) |
| 🔄 **Auto Retry** | Configurable retry logic with exponential backoff |
| 💾 **Session Persistence** | Chat history survives page refresh |
| 🌙 **Dark Mode** | Full dark mode support out of the box |
| 📦 **Tree-shakable** | Import only what you need |
| 🎯 **TypeScript** | Full TypeScript support |

---

## 📦 Installation

\`\`\`bash
npm install @doderasoftware/restify-ai
# or
pnpm add @doderasoftware/restify-ai
\`\`\`

**Peer Dependencies:** \`vue ^3.4\`, \`pinia ^2.1\`

---

## 🚀 Quick Start

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'
import '@doderasoftware/restify-ai/styles'

const app = createApp(App)
app.use(createPinia())

app.use(RestifyAiPlugin, {
  endpoints: {
    ask: '/api/ai/ask',        // Required - SSE streaming endpoint
    quota: '/api/ai/quota',    // Optional - quota endpoint
    uploadFile: '/api/ai/upload', // Optional - file upload
  },
  getAuthToken: () => localStorage.getItem('token'),
})

app.mount('#app')
\`\`\`

\`\`\`vue
<!-- App.vue -->
<template>
  <AiChatDrawer v-model="showChat" />
  <button @click="showChat = true">Open AI Chat</button>
</template>

<script setup>
import { ref } from 'vue'
import { AiChatDrawer } from '@doderasoftware/restify-ai'

const showChat = ref(false)
</script>
\`\`\`

---

## ⚙️ Plugin Configuration

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| \`endpoints.ask\` | \`string\` | SSE streaming endpoint |
| \`getAuthToken\` | \`() => string \| Promise<string>\` | Auth token getter |

### API Configuration

\`\`\`typescript
{
  baseUrl: 'https://api.example.com',
  endpoints: {
    ask: '/api/ai/ask',
    quota: '/api/ai/quota',
    uploadFile: '/api/ai/upload',
  },
  getAuthToken: () => authStore.token,
  getCustomHeaders: () => ({
    'X-CSRF-TOKEN': csrfToken,
    'X-App-Version': '1.0.0',
  }),
}
\`\`\`

### Request Customization

\`\`\`typescript
{
  // Modify request payload before sending
  buildRequest: (payload) => ({
    ...payload,
    context: { page: 'dashboard' },
  }),
  
  // Custom stream parser (default: OpenAI format)
  parseStreamContent: (data) => JSON.parse(data).content,
  
  // Request/response interceptors
  requestInterceptor: (url, options) => options,
  responseInterceptor: (response) => response,
}
\`\`\`

### Retry Configuration

\`\`\`typescript
{
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // ms, multiplied by attempt
    shouldRetry: (error, attempt) => error.status >= 500,
  },
}
\`\`\`

### Providers

\`\`\`typescript
{
  // @Mention providers
  mentionProviders: [
    {
      type: 'employee',
      label: 'Employees',
      priority: 10,
      search: async (query) => api.searchEmployees(query),
    },
  ],
  
  // Route-aware suggestions
  suggestionProviders: [
    {
      id: 'dashboard',
      routes: ['/dashboard', '/analytics'],
      getSuggestions: (context) => [...],
    },
  ],
  
  // Default suggestions for empty state
  defaultSuggestions: [
    { id: '1', title: 'How can you help?', prompt: 'What can you do?' },
  ],
}
\`\`\`

### Limits & Storage

\`\`\`typescript
{
  chatHistoryLimit: 15,           // Max messages
  maxAttachments: 5,              // Max files per message
  maxFileSize: 10 * 1024 * 1024,  // 10MB
  acceptedFileTypes: 'image/*,.pdf,.txt',
  chatHistoryKey: 'my_chat_history',    // sessionStorage key
  drawerStateKey: 'my_drawer_state',    // localStorage key
}
\`\`\`

### Features

\`\`\`typescript
{
  keyboardShortcut: 'cmd+g',    // null to disable
  enableSupportMode: true,      // Support request toggle
}
\`\`\`

### Custom Components

\`\`\`typescript
{
  assistantAvatar: MyAvatarComponent,
  userAvatar: UserAvatarComponent,
}
\`\`\`

### Lifecycle Callbacks

\`\`\`typescript
{
  onError: (error) => console.error(error),
  onQuotaFetched: (quota) => console.log(quota),
  onMessageSent: (message) => analytics.track('message_sent'),
  onResponseReceived: (message) => console.log(message),
  onDrawerToggle: (isOpen) => console.log(isOpen),
  onNewChat: () => console.log('New chat started'),
  
  // Stream hooks
  onStreamStart: () => console.log('Streaming...'),
  onStreamEnd: (fullMessage) => console.log('Done'),
  onStreamChunk: (chunk) => console.log(chunk.content),
  beforeSend: (payload) => payload,
  afterResponse: (message) => saveToHistory(message),
  
  // File upload hooks
  onFileUploadStart: (file) => console.log('Uploading', file.name),
  onFileUploadProgress: (file, progress) => console.log(progress),
  onFileUploadComplete: (file) => console.log('Done'),
  onFileUploadError: (file, error) => console.error(error),
}
\`\`\`

### Labels / i18n

\`\`\`typescript
{
  labels: {
    aiName: 'My AI Assistant',
    inputPlaceholder: 'Type your message...',
    emptyStateTitle: 'How can I help?',
    // 40+ customizable labels
  },
  translate: (key, params) => i18n.t(key, params),
  can: (permission) => user.hasPermission(permission),
}
\`\`\`

---

## 🧩 Components

### \`<AiChatDrawer>\`

Main chat drawer component with all features.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`v-model\` | \`boolean\` | - | Drawer visibility |
| \`width\` | \`string\` | \`'600px'\` | Drawer width |
| \`fullscreenWidth\` | \`string\` | \`'90vw'\` | Fullscreen width |
| \`position\` | \`'left' \| 'right'\` | \`'right'\` | Drawer position |
| \`showBackdrop\` | \`boolean\` | \`false\` | Show backdrop overlay |
| \`closeOnBackdropClick\` | \`boolean\` | \`false\` | Close on backdrop click |
| \`closeOnEscape\` | \`boolean\` | \`true\` | Close on Escape key |
| \`showQuota\` | \`boolean\` | \`true\` | Show quota display |
| \`showFullscreenToggle\` | \`boolean\` | \`true\` | Show fullscreen button |
| \`showMinimizeButton\` | \`boolean\` | \`true\` | Show minimize button |
| \`showCloseButton\` | \`boolean\` | \`true\` | Show close button |
| \`showNewChatButton\` | \`boolean\` | \`true\` | Show new chat button |
| \`confirmClose\` | \`boolean\` | \`true\` | Confirm before closing |
| \`ui\` | \`AiChatDrawerUI\` | - | Custom CSS classes |
| \`texts\` | \`AiChatDrawerTexts\` | - | Custom text labels |
| \`historyLimit\` | \`HistoryLimitConfig\` | - | History limit config |
| \`loadingText\` | \`LoadingTextConfig\` | - | Dynamic loading text |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| \`close\` | - | Drawer closed |
| \`contact-support\` | - | Support mode triggered |
| \`new-chat\` | - | New chat started |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| \`header\` | \`HeaderSlotProps\` | Custom header |
| \`empty-state\` | \`{ suggestions, onClick }\` | Custom empty state |
| \`message\` | \`MessageSlotProps\` | Custom message rendering |
| \`input\` | \`InputSlotProps\` | Custom input |
| \`quota\` | \`{ quota }\` | Custom quota display |
| \`setup\` | - | Custom setup guide |
| \`context-link\` | - | Link above input |

### Other Components

| Component | Description |
|-----------|-------------|
| \`<ChatInput>\` | Message input with attachments & mentions |
| \`<ChatMessage>\` | Single message display |
| \`<AiEmptyState>\` | Empty state with suggestions |
| \`<MentionList>\` | @mention dropdown |
| \`<AiAvatar>\` | AI avatar icon |
| \`<UserAvatar>\` | User avatar icon |
| \`<ChatMessageActions>\` | Copy/action buttons |

All components accept \`:ui\` and \`:texts\` props for full customization.

---

## 🎨 UI Customization

Every component accepts a \`:ui\` prop for CSS class overrides:

\`\`\`vue
<AiChatDrawer
  :ui="{
    drawer: 'my-drawer-class',
    header: 'my-header-class',
    body: 'my-body-class',
  }"
  :texts="{
    title: 'My AI',
    placeholder: 'Ask anything...',
  }"
/>
\`\`\`

### Available UI Props

- \`AiChatDrawerUI\` - backdrop, drawer, panel, header, body, etc.
- \`ChatInputUI\` - root, textarea, sendButton, attachButton, etc.
- \`ChatMessageUI\` - userBubble, assistantBubble, loadingDots, etc.
- \`AiEmptyStateUI\` - grid, suggestionCard, title, etc.
- \`MentionListUI\` - item, itemSelected, groupHeader, etc.

---

## 📚 Composables

\`\`\`typescript
import {
  useRestifyAiStore,      // Pinia store
  useAiSuggestions,       // Suggestions management
  useAiContext,           // Page context
  usePageAiContext,       // Route-based context
  useKeyboardShortcut,    // Custom shortcuts
  useAiDrawerShortcut,    // Drawer toggle shortcut
  useMentionParsing,      // Parse @mentions
  useChatMarkdown,        // Markdown rendering
  useChatScroll,          // Auto-scroll
  useChatErrorHandling,   // Error management
  useLoadingText,         // Dynamic loading messages
  useHistoryLimit,        // History limit dialogs
} from '@doderasoftware/restify-ai'
\`\`\`

### Store Actions

\`\`\`typescript
const store = useRestifyAiStore()

store.askQuestion(question, attachments, mentions)
store.cancelRequest()
store.retry()
store.clearChatHistory()
store.clearError()
store.fetchQuota()
store.toggleSupportMode()
\`\`\`

### Store State

\`\`\`typescript
store.chatHistory      // ChatMessage[]
store.sending          // boolean
store.error            // ChatError
store.quota            // ChatQuota
store.showChat         // boolean
store.isFullscreen     // boolean
store.supportRequestMode // boolean
\`\`\`

---

## 🔧 Advanced Features

### History Limit Dialog

\`\`\`vue
<AiChatDrawer
  :history-limit="{
    limit: 20,
    showWarningAt: 3,
    warningMessage: 'Almost at limit!',
    limitMessage: 'Start a new chat to continue.',
  }"
/>
\`\`\`

### Dynamic Loading Text

\`\`\`vue
<AiChatDrawer
  :loading-text="{
    messages: ['Thinking...', 'Analyzing...', 'Almost done...'],
    intervals: [0, 2000, 4000],
  }"
/>
\`\`\`

### Keyboard Shortcut

\`\`\`typescript
// Plugin config
{ keyboardShortcut: 'cmd+shift+a' }

// Or use composable
const { toggle } = useAiDrawerShortcut()
\`\`\`

---

## 📡 Laravel Restify Backend

Expected SSE endpoint format:

\`\`\`php
// routes/api.php
Route::post('/ai/ask', [AiController::class, 'ask']);
Route::get('/ai/quota', [AiController::class, 'quota']);
\`\`\`

\`\`\`php
// AiController.php
public function ask(Request $request)
{
    return response()->stream(function () use ($request) {
        // Stream OpenAI-format chunks
        echo "data: " . json_encode([
            'choices' => [['delta' => ['content' => 'Hello']]]
        ]) . "\n\n";
        ob_flush();
        flush();
        
        echo "data: [DONE]\n\n";
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
        'X-Accel-Buffering' => 'no',
    ]);
}
\`\`\`

---

## 📝 TypeScript Types

All types are exported:

\`\`\`typescript
import type {
  ChatMessage,
  ChatAttachment,
  Mention,
  MentionProvider,
  SuggestionProvider,
  AISuggestion,
  RestifyAiConfig,
  ChatQuota,
  ChatError,
  // UI types
  AiChatDrawerUI,
  ChatInputUI,
  ChatMessageUI,
  // Text types
  AiChatDrawerTexts,
  ChatInputTexts,
  // Config types
  HistoryLimitConfig,
  LoadingTextConfig,
  RetryConfig,
  // Hook types
  BeforeSendHook,
  AfterResponseHook,
  StreamParserFunction,
} from '@doderasoftware/restify-ai'
\`\`\`

---

## 📋 Quick Reference

| Feature | Configuration |
|---------|---------------|
| SSE Streaming | Built-in, automatic |
| Keyboard Shortcut | \`keyboardShortcut: 'cmd+g'\` |
| @Mentions | \`mentionProviders: [...]\` |
| Route Suggestions | \`suggestionProviders: [...]\` |
| File Attachments | \`endpoints.uploadFile\` + \`maxAttachments\` |
| Support Mode | \`enableSupportMode: true\` |
| Custom Headers | \`getCustomHeaders: () => ({...})\` |
| Auth Token | \`getAuthToken: () => token\` |
| Base URL | \`baseUrl: 'https://api.example.com'\` |
| Error Handling | \`onError: (err) => {...}\` |
| Retry Logic | \`retry: { maxRetries: 3 }\` |
| UI Customization | \`:ui\` prop on all components |
| Text/i18n | \`:texts\` prop + \`labels\` config |
| History Limit | \`:history-limit\` prop |
| Loading Messages | \`:loading-text\` prop |

---

## 📄 License

MIT © [Dodera Software](https://github.com/doderasoftware)
