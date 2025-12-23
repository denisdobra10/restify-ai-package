# @doderasoftware/restify-ai

A production-ready AI chatbot component for Vue 3 with real-time SSE streaming, file attachments, @mentions, and seamless [Laravel Restify](https://laravel-restify.com) integration.

[![npm version](https://img.shields.io/npm/v/@doderasoftware/restify-ai.svg)](https://www.npmjs.com/package/@doderasoftware/restify-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

**📖 [Laravel Restify](https://laravel-restify.com) | 📦 [npm](https://www.npmjs.com/package/@doderasoftware/restify-ai) | 🏢 [BinarCode](https://binarcode.com)**

---

## ✨ Features

- 🌊 **Real-time SSE Streaming** - Smooth character-by-character response streaming
- 📎 **File Attachments** - Upload and process documents, images, and more
- 👥 **@Mentions System** - Reference entities from your application (employees, jobs, projects, etc.)
- 💡 **Context-Aware Suggestions** - Smart prompts based on current page/route
- 💬 **Chat History** - Persistent conversation memory with configurable limits
- 📝 **Markdown Rendering** - Beautiful formatting with syntax highlighting
- 📊 **Quota Management** - Track and display API usage limits
- 🎨 **Fully Customizable** - Override any style with CSS classes
- 🌙 **Dark Mode Support** - Automatic dark/light theme detection
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** - Quick access with configurable shortcuts
- 🔳 **Fullscreen Mode** - Expandable chat interface
- 🎯 **TypeScript First** - Full type definitions included
- 🗃️ **Pinia Integration** - State management built-in
- 🔧 **Slot-Based Customization** - Override any component section
- 🌐 **i18n Ready** - Full internationalization support
- 🆘 **Support Mode** - Route conversations to human support
- 🔄 **Retry Logic** - Automatic retry with configurable backoff

## 📦 Installation

```bash
npm install @doderasoftware/restify-ai
```

### Peer Dependencies

```bash
npm install vue@^3.3.0 pinia@^2.1.0
```

## 🚀 Quick Start

### 1. Import Styles

```typescript
// main.ts
import '@doderasoftware/restify-ai/styles'
```

### 2. Create Plugin Configuration

```typescript
// plugins/restifyAi.ts
import type { App } from 'vue'
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'
import '@doderasoftware/restify-ai/styles'

export function setupRestifyAi(app: App) {
  app.use(RestifyAiPlugin, {
    endpoints: {
      ask: '/ask',
      uploadFile: '/ai/upload',
      quota: '/ai/quota',
    },
    baseUrl: import.meta.env.VITE_API_URL,
    getAuthToken: () => localStorage.getItem('token'),
  })
}
```

### 3. Register in Main

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupRestifyAi } from './plugins/restifyAi'
import '@doderasoftware/restify-ai/styles'

const app = createApp(App)
app.use(createPinia())
setupRestifyAi(app)
app.mount('#app')
```

### 4. Add the Component

```vue
<template>
  <AiChatDrawer v-model="aiStore.showChat" top-offset="50px" />
</template>

<script setup lang="ts">
import { AiChatDrawer, useRestifyAiStore } from '@doderasoftware/restify-ai'

const aiStore = useRestifyAiStore()
</script>
```

### 5. Enable Keyboard Shortcut (Optional)

```typescript
// In your layout or App.vue
import { useAiDrawerShortcut } from '@doderasoftware/restify-ai'

useAiDrawerShortcut() // Enables Cmd/Ctrl+G to toggle
```

## ⚙️ Configuration

### Full Configuration Options

```typescript
import type { App } from 'vue'
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'
import type { MentionProvider, SuggestionProvider, AISuggestion } from '@doderasoftware/restify-ai'

export function setupRestifyAi(app: App) {
  app.use(RestifyAiPlugin, {
    // ═══════════════════════════════════════════════════════════════
    // REQUIRED
    // ═══════════════════════════════════════════════════════════════
    
    endpoints: {
      ask: '/ask',                    // SSE streaming endpoint
      uploadFile: '/ai/upload',       // File upload endpoint
      quota: '/ai/quota',             // Quota fetch endpoint
    },
    getAuthToken: () => localStorage.getItem('token'),

    // ═══════════════════════════════════════════════════════════════
    // API CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    
    baseUrl: 'https://api.example.com',
    
    // Custom headers for every request
    getCustomHeaders: () => ({
      'X-Tenant-ID': getTenantId(),
      'Accept-Language': getCurrentLocale(),
    }),
    
    // Transform request payload before sending
    buildRequest: (payload) => ({
      ...payload,
      customField: 'value',
    }),
    
    // Parse SSE stream content (default handles OpenAI format)
    parseStreamContent: (data) => {
      const parsed = JSON.parse(data)
      return parsed.choices?.[0]?.delta?.content || null
    },

    // ═══════════════════════════════════════════════════════════════
    // RETRY CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    
    retry: {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: (error, attempt) => attempt < 3,
    },

    // ═══════════════════════════════════════════════════════════════
    // INTERNATIONALIZATION
    // ═══════════════════════════════════════════════════════════════
    
    // Translate function for i18n integration
    translate: (key, params) => i18n.t(key, params),
    
    // Permission check function
    can: (permission) => userCan(permission),

    // ═══════════════════════════════════════════════════════════════
    // LABELS (all customizable)
    // ═══════════════════════════════════════════════════════════════
    
    labels: {
      title: 'AI Assistant',
      aiName: 'AI Assistant',
      you: 'You',
      newChat: 'New chat',
      placeholder: 'Ask me anything...',
      inputPlaceholder: 'Ask me anything...',
      supportPlaceholder: 'Describe your issue...',
      loadingText: 'Gathering data...',
      analyzingText: 'Analyzing...',
      craftingText: 'Crafting response...',
      quotaRemaining: 'questions remaining',
      noQuota: 'No AI credit available',
      contactSupport: 'Contact Support',
      close: 'Close',
      minimize: 'Minimize',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit fullscreen',
      copyToClipboard: 'Copy to clipboard',
      copied: 'Content copied to clipboard',
      showMore: 'Show more',
      showLess: 'Show less',
      retry: 'Retry',
      attachFiles: 'Attach files',
      emptyStateTitle: 'How can I help you today?',
      emptyStateDescription: 'Ask questions or get help with tasks',
      keyboardShortcutHint: 'Press ⌘G to toggle',
      sendMessage: 'Send message',
      attachFile: 'Attach file',
      closeConfirmTitle: 'Close chat window?',
      closeConfirmMessage: 'You will lose the conversation.',
      confirmClose: 'Yes, close it',
      cancel: 'Cancel',
      toggleSupportMode: 'Contact Support',
      exitSupportMode: 'Exit Support Mode',
      historyLimitReachedTitle: 'Conversation Limit Reached',
      historyLimitReachedMessage: 'Maximum messages reached.',
      startNewChat: 'New Chat',
    },

    // ═══════════════════════════════════════════════════════════════
    // MENTION PROVIDERS
    // ═══════════════════════════════════════════════════════════════
    
    mentionProviders: createMentionProviders(),

    // ═══════════════════════════════════════════════════════════════
    // SUGGESTION PROVIDERS
    // ═══════════════════════════════════════════════════════════════
    
    suggestionProviders: createSuggestionProviders(),
    defaultSuggestions: getDefaultSuggestions(),

    // ═══════════════════════════════════════════════════════════════
    // THEME
    // ═══════════════════════════════════════════════════════════════
    
    theme: {
      primaryColor: '#3b82f6',
      primaryLightColor: '#60a5fa',
      userBubbleColor: '#3b82f6',
      userTextColor: '#ffffff',
      borderColor: '#e5e7eb',
      drawerWidth: '600px',
      drawerFullscreenWidth: '90vw',
    },

    // ═══════════════════════════════════════════════════════════════
    // LIMITS
    // ═══════════════════════════════════════════════════════════════
    
    chatHistoryLimit: 15,
    maxAttachments: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedFileTypes: 'image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv',

    // ═══════════════════════════════════════════════════════════════
    // STORAGE
    // ═══════════════════════════════════════════════════════════════
    
    chatHistoryKey: 'app_chat_history',
    drawerStateKey: 'app_chat_drawer_open',

    // ═══════════════════════════════════════════════════════════════
    // FEATURES
    // ═══════════════════════════════════════════════════════════════
    
    keyboardShortcut: 'mod+g',  // 'mod' = Cmd on Mac, Ctrl on Windows
    enableSupportMode: true,
    canToggle: () => true,

    // ═══════════════════════════════════════════════════════════════
    // AVATARS
    // ═══════════════════════════════════════════════════════════════
    
    assistantAvatar: CustomAiAvatarComponent,
    userAvatar: () => authStore.profile?.avatar || null,

    // ═══════════════════════════════════════════════════════════════
    // CALLBACKS
    // ═══════════════════════════════════════════════════════════════
    
    onError: (error) => console.error('AI Error:', error),
    onQuotaFetched: (quota) => console.log('Quota:', quota),
    onMessageSent: (message) => analytics.track('ai_message_sent'),
    onResponseReceived: (message) => console.log('Response:', message),
    onDrawerToggle: (isOpen) => console.log('Drawer:', isOpen),
    onNewChat: () => console.log('New chat started'),
    
    // Stream lifecycle hooks
    onStreamStart: () => console.log('Stream started'),
    onStreamEnd: (fullMessage) => console.log('Stream ended'),
    onStreamChunk: (chunk) => console.log('Chunk:', chunk),
    beforeSend: (payload) => payload,
    afterResponse: (message) => {},

    // File upload hooks
    onFileUploadStart: (file) => {},
    onFileUploadProgress: (file, progress) => {},
    onFileUploadComplete: (file) => {},
    onFileUploadError: (file, error) => {},
  })
}
```

## 📋 AiChatDrawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | required | Controls drawer visibility (v-model) |
| `width` | `string` | `"600px"` | Drawer width |
| `fullscreenWidth` | `string` | `"90vw"` | Width when in fullscreen mode |
| `topOffset` | `string` | `"0"` | Top offset for fixed headers |
| `position` | `"left" \| "right"` | `"right"` | Drawer position |
| `showBackdrop` | `boolean` | `false` | Show backdrop overlay |
| `closeOnBackdropClick` | `boolean` | `false` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `showQuota` | `boolean` | `true` | Show quota display |
| `showFullscreenToggle` | `boolean` | `true` | Show fullscreen button |
| `showMinimizeButton` | `boolean` | `true` | Show minimize button |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `showNewChatButton` | `boolean` | `true` | Show new chat button |
| `confirmClose` | `boolean` | `true` | Confirm before clearing history |
| `autoFetchQuota` | `boolean` | `true` | Auto-fetch quota when opened |
| `historyLimit` | `HistoryLimitConfig` | - | History limit configuration |
| `loadingText` | `LoadingTextConfig` | - | Loading text configuration |
| `ui` | `AiChatDrawerUI` | `{}` | Custom CSS classes |
| `texts` | `AiChatDrawerTexts` | `{}` | Custom text labels |

### Component Usage Example

```vue
<template>
  <AiChatDrawer
    v-model="aiStore.showChat"
    top-offset="50px"
    :show-backdrop="false"
    :confirm-close="true"
    :show-quota="true"
    @contact-support="handleContactSupport"
  >
    <template #context-link>
      <p class="text-center text-xs text-gray-500">
        For accurate results, provide
        <router-link to="/settings/ai-context" class="text-primary-600 hover:underline">
          company context
        </router-link>
      </p>
    </template>
  </AiChatDrawer>
</template>

<script setup lang="ts">
import { AiChatDrawer, useRestifyAiStore, useAiDrawerShortcut } from '@doderasoftware/restify-ai'

const aiStore = useRestifyAiStore()

useAiDrawerShortcut()

function handleContactSupport() {
  // Handle support request
}
</script>
```

## 📡 Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Drawer state changed |
| `close` | - | Drawer was closed |
| `contact-support` | - | Support mode activated |
| `new-chat` | - | New chat started |

## 🎰 Slots

| Slot | Props | Description |
|------|-------|-------------|
| `header` | `HeaderSlotProps` | Custom header content |
| `quota` | `{ quota: ChatQuota }` | Custom quota display |
| `setup` | - | Custom setup guide |
| `empty-state` | `{ suggestions, onClick }` | Custom empty state |
| `message` | `MessageSlotProps` | Custom message bubble |
| `input` | `InputSlotProps` | Custom input area |
| `context-link` | - | Custom context link below input |

### Slot Props Types

```typescript
interface HeaderSlotProps {
  quota: ChatQuota
  isFullscreen: boolean
  hasHistory: boolean
  onNewChat: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleFullscreen: () => void
}

interface MessageSlotProps {
  message: ChatMessage
  isUser: boolean
  isLoading: boolean
  isStreaming: boolean
}

interface InputSlotProps {
  modelValue: string
  sending: boolean
  disabled: boolean
  onSubmit: (payload: SubmitPayload) => void
  onCancel: () => void
}
```

## 🏪 Store API

```typescript
import { useRestifyAiStore } from '@doderasoftware/restify-ai'

const store = useRestifyAiStore()

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

store.chatHistory         // ChatMessage[] - All messages
store.showChat            // boolean - Drawer visibility
store.sending             // boolean - Message being sent
store.loading             // boolean - Loading state
store.isFullscreen        // boolean - Fullscreen mode
store.quota               // { limit, used, remaining }
store.error               // { message, failedQuestion, failedAttachments, timestamp }
store.supportRequestMode  // boolean - Support mode active
store.pageContext         // PageContext | null - Current page context

// ═══════════════════════════════════════════════════════════════
// GETTERS
// ═══════════════════════════════════════════════════════════════

store.hasMessages         // boolean - Has any messages
store.isInSetupMode       // boolean - In setup mode
store.canChat             // boolean - Can send messages

// ═══════════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════════

store.toggleDrawer()            // Toggle drawer visibility
store.openDrawer()              // Open drawer
store.closeDrawer()             // Close drawer
store.askQuestion(question, attachments?, mentions?, isSupportRequest?)
store.cancelRequest()           // Cancel current request
store.retry()                   // Retry failed message
store.clearChatHistory()        // Clear all messages
store.clearError()              // Clear error state
store.toggleSupportMode()       // Toggle support mode
store.fetchQuota()              // Fetch quota from server
store.uploadFile(file)          // Upload file
store.setPageContext(context)   // Set page context
store.scrollToBottom()          // Scroll chat to bottom
```

## 🪝 Composables

### useAiDrawerShortcut

Toggle drawer with keyboard shortcut:

```typescript
import { useAiDrawerShortcut } from '@doderasoftware/restify-ai'

// Uses store's showChat state directly
useAiDrawerShortcut()
```

### usePageAiContext

Set page context for AI suggestions:

```typescript
import { usePageAiContext } from '@doderasoftware/restify-ai'

// Simple usage
usePageAiContext('invoices')

// With dynamic metadata
usePageAiContext('employee-detail', {
  employeeId: computed(() => route.params.id),
  employeeName: computed(() => employee.value?.name),
})
```

### useAiContext

Programmatic context control:

```typescript
import { useAiContext } from '@doderasoftware/restify-ai'

const { setContext, updateContext, clearContext, context } = useAiContext()

setContext({
  pageType: 'dashboard',
  entityType: 'report',
  entityId: '123',
  metadata: { period: 'Q4' }
})
```

### useAiSuggestions

Get suggestions for current context:

```typescript
import { useAiSuggestions } from '@doderasoftware/restify-ai'

const { suggestions, resolvePrompt } = useAiSuggestions()
```

## 🏷️ Mention Providers

Enable @mentions to reference entities from your application:

```typescript
import type { MentionProvider, MentionItem } from '@doderasoftware/restify-ai'

function createMentionProviders(): MentionProvider[] {
  return [
    {
      type: 'employee',
      label: 'Team Members',
      iconClass: 'text-primary',
      priority: 10,
      
      // Search function - can be sync or async
      search: (query: string): MentionItem[] => {
        const employeeStore = useEmployeeStore()
        const employees = employeeStore.allEmployees || []

        if (!query) {
          return employees.slice(0, 5).map(emp => ({
            id: emp.id,
            type: 'employee',
            attributes: emp.attributes,
          }))
        }

        const lowerQuery = query.toLowerCase()
        return employees
          .filter((emp) => {
            const firstName = emp.attributes?.first_name?.toLowerCase() || ''
            const lastName = emp.attributes?.last_name?.toLowerCase() || ''
            return firstName.includes(lowerQuery) || lastName.includes(lowerQuery)
          })
          .slice(0, 5)
          .map(emp => ({
            id: emp.id,
            type: 'employee',
            attributes: emp.attributes,
          }))
      },
      
      // Display formatting
      getDisplayName: (item: MentionItem): string => {
        const firstName = item.attributes?.first_name || ''
        const lastName = item.attributes?.last_name || ''
        return `${firstName} ${lastName}`.trim()
      },
      
      getSubtitle: (item: MentionItem): string | null => {
        return item.attributes?.position || null
      },
      
      buildMentionText: (item: MentionItem): string => {
        const firstName = item.attributes?.first_name || ''
        const lastName = item.attributes?.last_name || ''
        return `@${firstName} ${lastName}`.trim()
      },
    },
    {
      type: 'job',
      label: 'Jobs',
      iconClass: 'text-blue-500',
      routes: ['/hiring/jobs'],  // Only show on these routes
      priority: 5,
      search: async (query: string): Promise<MentionItem[]> => {
        const response = await api.get('/jobs', { params: { search: query }})
        return response.data.map(job => ({
          id: job.id,
          type: 'job',
          attributes: job,
        }))
      },
      getDisplayName: (item) => item.attributes?.title || 'Untitled',
      getSubtitle: (item) => item.attributes?.location || null,
    },
  ]
}
```

### MentionProvider Interface

```typescript
interface MentionProvider {
  type: string                                              // Unique type identifier
  label: string                                             // Display label for group
  icon?: Component                                          // Icon component
  iconClass?: string                                        // Icon CSS classes
  routes?: string[]                                         // Limit to specific routes
  priority?: number                                         // Sort order (higher = first)
  search: (query: string) => Promise<MentionItem[]> | MentionItem[]
  getDisplayName?: (item: MentionItem) => string
  getSubtitle?: (item: MentionItem) => string | null
  buildMentionText?: (item: MentionItem) => string
}

interface MentionItem {
  id: string
  type: string
  name?: string
  label?: string
  title?: string
  attributes?: Record<string, any> | null
  relationships?: Record<string, any> | null
}
```

## 💡 Suggestion Providers

Context-aware suggestions based on current page:

```typescript
import type { SuggestionProvider, AISuggestion, PageContext } from '@doderasoftware/restify-ai'
import { UserGroupIcon, ChartBarIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

function createSuggestionProviders(): SuggestionProvider[] {
  return [
    {
      id: 'employees',
      routes: ['/employees'],
      priority: 10,
      
      getSuggestions: (context: PageContext): AISuggestion[] => {
        const isDetailView = context.entityId
        const employeeName = context.metadata?.employeeName

        if (isDetailView && employeeName) {
          // Suggestions for employee detail page
          return [
            {
              id: 'performance-review',
              title: 'Prepare Evaluation',
              description: 'Performance review points',
              icon: ChartBarIcon,
              gradientClass: 'bg-gradient-to-br from-violet-500/10 to-purple-500/10',
              prompt: `Help me prepare a performance review for ${employeeName}.`,
              permission: 'manageEmployees',
            },
          ]
        }

        // Suggestions for employee list
        return [
          {
            id: 'find-available',
            title: 'Who is Available?',
            description: 'See who is not on leave',
            icon: CalendarDaysIcon,
            gradientClass: 'bg-gradient-to-br from-teal-500/10 to-emerald-500/10',
            prompt: 'Who is available today and not on leave?',
            permission: 'manageEmployees',
          },
          {
            id: 'team-analytics',
            title: 'Team Analysis',
            description: 'Team structure insights',
            icon: ChartBarIcon,
            gradientClass: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
            prompt: 'Give me an overview of our team structure.',
            permission: 'manageEmployees',
          },
        ]
      },
    },
    {
      id: 'hiring',
      routes: ['/hiring/jobs', '/hiring/candidates'],
      priority: 10,
      getSuggestions: (): AISuggestion[] => [
        {
          id: 'open-positions',
          title: 'Open Positions',
          description: 'List all open job positions',
          icon: UserGroupIcon,
          prompt: 'Show me all currently open job positions.',
        },
      ],
    },
  ]
}
```

### Default Suggestions

```typescript
function getDefaultSuggestions(): AISuggestion[] {
  return [
    {
      id: 'help',
      title: 'How can you help?',
      description: 'Learn what I can do',
      prompt: 'What can you help me with?',
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      description: 'Get help from a human',
      prompt: 'I need to contact support',
      isSupportRequest: true,
    },
  ]
}
```

### SuggestionProvider Interface

```typescript
interface SuggestionProvider {
  id: string                                                  // Unique identifier
  routes?: string[]                                           // Route patterns to match
  matcher?: (path: string, context: PageContext | null) => boolean
  getSuggestions: (context: PageContext) => AISuggestion[]
  extractContext?: (path: string) => Record<string, any>
  priority?: number                                           // Higher = first
}

interface AISuggestion {
  id: string
  title: string
  description?: string
  icon?: Component
  className?: string
  gradientClass?: string
  prompt: string | ((context: PageContext) => string)
  permission?: string
  category?: string
  isSupportRequest?: boolean
}
```

## 🎨 UI Customization

Override CSS classes for any component:

```vue
<AiChatDrawer
  v-model="isOpen"
  :ui="{
    backdrop: 'bg-black/50 backdrop-blur-sm',
    drawer: 'shadow-2xl',
    panel: 'bg-gray-50 dark:bg-gray-900',
    header: 'border-b-2 border-primary-500',
    body: 'custom-scrollbar',
    footer: 'border-t border-gray-200',
  }"
/>
```

### AiChatDrawerUI

```typescript
interface AiChatDrawerUI {
  backdrop?: string              // Backdrop overlay
  drawer?: string                // Main drawer container
  panel?: string                 // Inner panel
  header?: string                // Header container
  headerTitle?: string           // Header title
  headerActions?: string         // Header actions
  headerActionButton?: string    // Header buttons
  body?: string                  // Messages container
  footer?: string                // Footer container
  quotaDisplay?: string          // Quota display
  newChatButton?: string         // New chat button
  errorContainer?: string        // Error container
  errorMessage?: string          // Error message
  retryButton?: string           // Retry button
  closeConfirmModal?: string     // Confirm modal
  closeConfirmButton?: string    // Confirm button
  cancelButton?: string          // Cancel button
  historyLimitModal?: string     // History limit modal
  historyLimitButton?: string    // History limit button
}
```

### ChatInputUI

```typescript
interface ChatInputUI {
  root?: string                  // Root container
  form?: string                  // Form wrapper
  inputContainer?: string        // Input container
  inputWrapper?: string          // Input border wrapper
  textarea?: string              // Textarea element
  attachButton?: string          // Attach button
  sendButton?: string            // Send button
  sendButtonActive?: string      // Send active state
  sendButtonDisabled?: string    // Send disabled state
  stopButton?: string            // Stop button
  supportToggle?: string         // Support toggle
  supportBadge?: string          // Support badge
  attachmentsContainer?: string  // Attachments container
  attachmentItem?: string        // Attachment item
  attachmentThumbnail?: string   // Attachment thumbnail
  attachmentRemove?: string      // Remove button
  suggestionsDropdown?: string   // Suggestions dropdown
  suggestionItem?: string        // Suggestion item
  suggestionItemSelected?: string // Selected suggestion
  contextLink?: string           // Context link
}
```

### ChatMessageUI

```typescript
interface ChatMessageUI {
  root?: string                  // Root container
  userMessage?: string           // User message container
  userBubble?: string            // User bubble
  userAvatar?: string            // User avatar
  assistantMessage?: string      // Assistant container
  assistantBubble?: string       // Assistant bubble
  loadingIndicator?: string      // Loading indicator
  loadingDots?: string           // Loading dots
  content?: string               // Content wrapper
  attachmentsContainer?: string  // Attachments
  attachmentItem?: string        // Attachment item
  actionsContainer?: string      // Actions container
  showMoreButton?: string        // Show more button
}
```

## 📝 TypeScript Types

All types are exported:

```typescript
import type {
  // Core Config
  RestifyAiConfig,
  RestifyAiEndpoints,
  RestifyAiLabels,
  RestifyAiTheme,
  
  // Chat Types
  ChatMessage,
  ChatQuota,
  ChatError,
  ChatAttachment,
  ChatRole,
  SubmitPayload,
  
  // Context
  PageContext,
  
  // Providers
  MentionProvider,
  MentionItem,
  Mention,
  SuggestionProvider,
  AISuggestion,
  
  // History
  HistoryLimitConfig,
  LoadingTextConfig,
  
  // UI Customization
  AiChatDrawerUI,
  ChatInputUI,
  ChatMessageUI,
  AiEmptyStateUI,
  MentionListUI,
  
  // Text Customization
  AiChatDrawerTexts,
  ChatInputTexts,
  ChatMessageTexts,
  
  // Slot Props
  HeaderSlotProps,
  MessageSlotProps,
  InputSlotProps,
  EmptyStateSlotProps,
  
  // Hooks
  BeforeSendHook,
  AfterResponseHook,
  OnStreamStartHook,
  OnStreamEndHook,
  OnStreamChunkHook,
  StreamParserFunction,
  RetryConfig,
} from '@doderasoftware/restify-ai'
```

## 🔌 Backend Integration

This package is designed for [Laravel Restify](https://laravel-restify.com) backends:

### Ask Endpoint (SSE Stream)

```php
// routes/api.php
Route::post('/ask', [AiController::class, 'ask']);
```

**Request:**
```json
{
  "question": "Who is available today?",
  "history": [
    { "role": "user", "message": "Hello" },
    { "role": "assistant", "message": "Hi! How can I help?" }
  ],
  "stream": true,
  "files": [{ "id": "file-123", "name": "report.pdf" }],
  "mentions": [{ "id": "emp-1", "type": "employee", "name": "John Doe" }],
  "contact_support": false
}
```

**Response (SSE):**
```
data: {"choices":[{"delta":{"content":"Based on"}}]}
data: {"choices":[{"delta":{"content":" the schedule..."}}]}
data: [DONE]
```

### Quota Endpoint

```php
// routes/api.php
Route::get('/ai/quota', [AiController::class, 'quota']);
```

**Response:**
```json
{
  "data": {
    "limit": 100,
    "used": 25,
    "remaining": 75
  }
}
```

### Upload Endpoint

```php
// routes/api.php
Route::post('/ai/upload', [AiController::class, 'upload']);
```

**Response:**
```json
{
  "data": {
    "id": "file-123",
    "name": "document.pdf",
    "url": "/storage/uploads/document.pdf",
    "type": "application/pdf",
    "size": 102400
  }
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + G` | Toggle drawer (configurable) |
| `Escape` | Close drawer |
| `Enter` | Send message |
| `Shift + Enter` | New line |

## 💾 Session Storage

Chat history persists in `sessionStorage` by default:

- Key: `restify_ai_chat_history` (configurable via `chatHistoryKey`)
- Cleared on browser close
- Persists across page navigation

## 📦 Package Exports

```typescript
// Components
export { AiChatDrawer } from './components'

// Store
export { useRestifyAiStore } from './store'

// Composables
export { 
  useAiDrawerShortcut,
  usePageAiContext,
  useAiContext,
  useAiSuggestions 
} from './composables'

// Config
export { 
  initRestifyAi, 
  getConfig, 
  getLabels, 
  getUI,
  RestifyAiPlugin 
} from './config'

// Types
export * from './types'
```

## 🤝 Requirements

- **Vue 3.3+**
- **Pinia 2.1+**
- A backend implementing the streaming chat API (e.g., [Laravel Restify](https://laravel-restify.com))

## 🔗 Links

- [📖 Laravel Restify Documentation](https://laravel-restify.com)
- [📦 npm Package](https://www.npmjs.com/package/@doderasoftware/restify-ai)
- [🏢 BinarCode](https://binarcode.com)
- [💻 GitHub](https://github.com/BinarCode/laravel-restify)

## 📄 License

MIT © [BinarCode](https://binarcode.com)

---

Built with ❤️ by the [BinarCode](https://binarcode.com) team · Published by [Dodera Software](https://doderasoft.com)
