# @doderasoftware/restify-ai - Quick Usage Guide

This guide shows how to quickly integrate the AI chatbot into your Vue 3 + Laravel Restify project.

## Installation

```bash
npm install @doderasoftware/restify-ai
# or
pnpm add @doderasoftware/restify-ai
```

## Basic Setup (Minimal - 5 lines)

```typescript
// main.ts
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'
import '@doderasoftware/restify-ai/styles'

app.use(RestifyAiPlugin, {
  endpoints: {
    ask: '/api/ai/ask',
    quota: '/api/ai/quota',
  },
  getAuthToken: () => localStorage.getItem('token'),
})
```

```vue
<!-- App.vue or Layout.vue -->
<template>
  <AiChatDrawer v-model="isOpen" />
</template>

<script setup>
import { ref } from 'vue'
import { AiChatDrawer, useAiDrawerShortcut } from '@doderasoftware/restify-ai'

const isOpen = ref(false)

// Optional: Enable Cmd+G / Ctrl+G keyboard shortcut
useAiDrawerShortcut(isOpen)
</script>
```

**That's it!** The chat drawer is now functional with SSE streaming.

---

## Growee-Style Setup (Full Features)

Here's how Growee would configure the package with all features:

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'
import type { MentionProvider, SuggestionProvider, AISuggestion } from '@doderasoftware/restify-ai'
import '@doderasoftware/restify-ai/styles'

const app = createApp(App)
app.use(createPinia())

// Mention providers for @mentions (employees, jobs, candidates, projects)
const mentionProviders: MentionProvider[] = [
  {
    type: 'employee',
    label: 'Employees',
    priority: 10,
    search: async (query) => {
      const { data } = await api.get('/api/employees', { params: { search: query } })
      return data.data // Returns array of { id, name, type, attributes }
    },
    getDisplayName: (item) => item.attributes?.name || item.name,
    getSubtitle: (item) => item.attributes?.email,
  },
  {
    type: 'job',
    label: 'Jobs',
    priority: 8,
    search: async (query) => {
      const { data } = await api.get('/api/jobs', { params: { search: query } })
      return data.data
    },
  },
  {
    type: 'candidate',
    label: 'Candidates',
    priority: 6,
    search: async (query) => {
      const { data } = await api.get('/api/candidates', { params: { search: query } })
      return data.data
    },
  },
  {
    type: 'project',
    label: 'Projects',
    priority: 4,
    search: async (query) => {
      const { data } = await api.get('/api/projects', { params: { search: query } })
      return data.data
    },
  },
]

// Route-based suggestion providers
const suggestionProviders: SuggestionProvider[] = [
  {
    id: 'employees',
    routes: ['/employees*'],
    priority: 10,
    getSuggestions: (context) => [
      {
        id: 'employee-overview',
        title: 'Employee Overview',
        description: 'Get insights about employee data',
        prompt: 'Give me an overview of employee statistics',
        category: 'hr',
      },
      {
        id: 'upcoming-birthdays',
        title: 'Upcoming Birthdays',
        description: 'Show employees with upcoming birthdays',
        prompt: 'Show me employees with birthdays this month',
        category: 'hr',
      },
    ],
  },
  {
    id: 'jobs',
    routes: ['/jobs*'],
    priority: 10,
    getSuggestions: () => [
      {
        id: 'open-positions',
        title: 'Open Positions',
        description: 'List all open job positions',
        prompt: 'What open positions do we have?',
        category: 'hr',
      },
    ],
  },
  {
    id: 'dashboard',
    routes: ['/dashboard*', '/'],
    priority: 5,
    getSuggestions: () => [
      {
        id: 'weekly-summary',
        title: 'Weekly Summary',
        description: 'Get a summary of this week',
        prompt: 'Give me a summary of activity this week',
        category: 'analytics',
      },
    ],
  },
]

// Default suggestions (shown when no route-specific ones match)
const defaultSuggestions: AISuggestion[] = [
  {
    id: 'help',
    title: 'How can you help?',
    description: 'Learn what I can do',
    prompt: 'What can you help me with?',
    category: 'support',
  },
  {
    id: 'analyze',
    title: 'Analyze Data',
    description: 'Get insights from your data',
    prompt: 'Analyze my recent data',
    category: 'analytics',
  },
]

app.use(RestifyAiPlugin, {
  // API Configuration
  baseUrl: import.meta.env.VITE_API_URL, // e.g., 'https://api.growee.io'
  endpoints: {
    ask: '/api/ai/ask',
    quota: '/api/ai/quota',
    uploadFile: '/api/ai/upload',
  },
  
  // Authentication
  getAuthToken: () => useAuthStore().token,
  
  // Custom headers (CSRF, app version, etc.)
  getCustomHeaders: () => ({
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
  }),
  
  // Providers
  mentionProviders,
  suggestionProviders,
  defaultSuggestions,
  
  // Labels (using i18n)
  labels: {
    aiName: 'Growee AI',
    emptyStateTitle: 'How can I help you today?',
    emptyStateDescription: 'Ask anything or pick a suggestion',
    quotaRemaining: '{count} questions left this month',
  },
  
  // Features
  keyboardShortcut: 'cmd+g',
  enableSupportMode: true,
  
  // Limits
  chatHistoryLimit: 20,
  maxAttachments: 5,
  maxFileSize: 10 * 1024 * 1024,
  
  // Callbacks
  onError: (error) => {
    toast.error(error.message)
  },
  onQuotaFetched: (quota) => {
    if (quota.remaining <= 5) {
      toast.warning('You have few AI questions remaining')
    }
  },
})

app.mount('#app')
```

## Layout Integration

```vue
<!-- layouts/DefaultLayout.vue -->
<template>
  <div class="min-h-screen">
    <AppHeader />
    <AppSidebar />
    
    <main>
      <slot />
    </main>
    
    <!-- AI Chat Drawer - Add this once in your layout -->
    <AiChatDrawer v-model="isAiOpen">
      <!-- Optional: Custom context link -->
      <template #context-link>
        <RouterLink 
          v-if="currentEntity" 
          :to="currentEntityLink"
          class="text-xs text-primary"
        >
          Viewing: {{ currentEntity.name }}
        </RouterLink>
      </template>
    </AiChatDrawer>
    
    <!-- Optional: Floating button to open chat -->
    <button
      class="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg"
      @click="isAiOpen = true"
    >
      <AiIcon />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AiChatDrawer, useAiDrawerShortcut } from '@doderasoftware/restify-ai'

const isAiOpen = ref(false)

// Cmd+G / Ctrl+G to toggle
useAiDrawerShortcut(isAiOpen)
</script>
```

## Page Context (Optional)

Provide page-specific context for smarter suggestions:

```vue
<!-- pages/EmployeeDetailPage.vue -->
<script setup>
import { usePageAiContext } from '@doderasoftware/restify-ai'

const employee = ref(null)

// Auto-registers context on mount, clears on unmount
usePageAiContext('employee-detail', {
  employeeId: computed(() => employee.value?.id),
  employeeName: computed(() => employee.value?.name),
})
</script>
```

## Store Access (Advanced)

```typescript
import { useRestifyAiStore } from '@doderasoftware/restify-ai'

const aiStore = useRestifyAiStore()

// Open/close drawer
aiStore.openDrawer()
aiStore.closeDrawer()
aiStore.toggleDrawer()

// Check state
aiStore.showChat      // boolean
aiStore.sending       // boolean
aiStore.chatHistory   // ChatMessage[]
aiStore.quota         // { limit, used, remaining }

// Actions
await aiStore.fetchQuota()
aiStore.clearChatHistory()
aiStore.toggleSupportMode()
```

## Laravel Restify Backend Example

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ai/ask', [AiController::class, 'ask']);
    Route::get('/ai/quota', [AiController::class, 'quota']);
    Route::post('/ai/upload', [AiController::class, 'upload']);
});

// AiController.php
public function ask(Request $request)
{
    $validated = $request->validate([
        'question' => 'required|string',
        'history' => 'array',
        'mentions' => 'array',
        'files' => 'array',
        'stream' => 'boolean',
    ]);

    return response()->stream(function () use ($validated) {
        // Your AI/LLM integration here
        $response = OpenAI::chat()->createStreamed([
            'model' => 'gpt-4',
            'messages' => $this->buildMessages($validated),
            'stream' => true,
        ]);

        foreach ($response as $chunk) {
            $content = $chunk->choices[0]->delta->content ?? '';
            echo "data: " . json_encode([
                'choices' => [['delta' => ['content' => $content]]]
            ]) . "\n\n";
            ob_flush();
            flush();
        }
        
        echo "data: [DONE]\n\n";
        ob_flush();
        flush();
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
        'Connection' => 'keep-alive',
        'X-Accel-Buffering' => 'no',
    ]);
}

public function quota(Request $request)
{
    $user = $request->user();
    
    return response()->json([
        'limit' => $user->ai_quota_limit,
        'used' => $user->ai_questions_used,
        'remaining' => $user->ai_quota_limit - $user->ai_questions_used,
    ]);
}
```

## Tailwind CSS Setup

Add the package's Tailwind preset to your config:

```javascript
// tailwind.config.js
module.exports = {
  presets: [
    require('@doderasoftware/restify-ai/tailwind'),
  ],
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@doderasoftware/restify-ai/dist/**/*.js',
  ],
}
```

---

## Summary

| Feature | Configuration |
|---------|--------------|
| SSE Streaming | Built-in, automatic |
| Keyboard Shortcut | `keyboardShortcut: 'cmd+g'` |
| @Mentions | `mentionProviders: [...]` |
| Route Suggestions | `suggestionProviders: [...]` |
| File Attachments | `endpoints.uploadFile` + `maxAttachments` |
| Support Mode | `enableSupportMode: true` |
| Custom Headers | `getCustomHeaders: () => ({...})` |
| Auth Token | `getAuthToken: () => token` |
| Base URL | `baseUrl: 'https://api.example.com'` |
| Error Handling | `onError: (err) => {...}` |
| Lifecycle Hooks | `onStreamStart`, `onStreamEnd`, `beforeSend`, etc. |
| UI Customization | `:ui` prop on all components |
| Text/i18n | `:texts` prop on all components |

---

## UI Customization

All components accept `:ui` and `:texts` props for complete styling and i18n control.

### AiChatDrawer Customization

```vue
<template>
  <AiChatDrawer
    v-model="isOpen"
    :ui="drawerUI"
    :texts="drawerTexts"
    width="700px"
    fullscreen-width="95vw"
    position="right"
    :show-backdrop="true"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
    :show-quota="true"
    :show-fullscreen-toggle="true"
    :show-minimize-button="true"
    :show-close-button="true"
    :show-new-chat-button="true"
    :confirm-close="true"
  />
</template>

<script setup lang="ts">
import type { AiChatDrawerUI, AiChatDrawerTexts } from '@doderasoftware/restify-ai'

// Custom classes for each element
const drawerUI: AiChatDrawerUI = {
  backdrop: 'bg-black/40',
  drawer: 'shadow-xl',
  panel: 'rounded-l-xl',
  header: 'bg-gray-50 dark:bg-gray-850',
  headerTitle: 'text-lg font-bold',
  headerActions: 'gap-2',
  headerActionButton: 'p-2.5 rounded-lg',
  body: 'bg-gray-50 dark:bg-gray-900',
  footer: 'border-t border-gray-200',
  closeConfirmModal: 'max-w-md rounded-2xl',
  closeConfirmButton: 'bg-red-600 hover:bg-red-700',
  cancelButton: 'bg-gray-100 hover:bg-gray-200',
  quotaDisplay: 'font-medium',
  newChatButton: 'rounded-full px-4',
  errorContainer: 'bg-red-50 rounded-lg p-3',
  errorMessage: 'font-medium',
  retryButton: 'underline hover:no-underline',
}

// All texts can be customized (great for i18n)
const drawerTexts: AiChatDrawerTexts = {
  title: 'AI Assistant',
  quotaRemaining: '{count} questions left',
  noQuota: 'No credits remaining',
  newChat: 'Start New',
  close: 'Close chat',
  minimize: 'Minimize',
  fullscreen: 'Expand',
  exitFullscreen: 'Collapse',
  closeConfirmTitle: 'End conversation?',
  closeConfirmMessage: 'This will clear your conversation history.',
  confirmClose: 'Yes, close',
  cancel: 'Keep open',
  retry: 'Try again',
  keyboardShortcutHint: 'Press ⌘G to toggle',
  placeholder: 'Ask me anything...',
  supportPlaceholder: 'Describe your issue...',
}
</script>
```

### ChatInput Customization

```vue
<template>
  <ChatInput
    v-model="message"
    :ui="inputUI"
    :texts="inputTexts"
    :sending="isSending"
  />
</template>

<script setup lang="ts">
import type { ChatInputUI, ChatInputTexts } from '@doderasoftware/restify-ai'

const inputUI: ChatInputUI = {
  root: 'bg-white dark:bg-gray-900',
  form: 'max-w-4xl mx-auto',
  inputContainer: 'relative',
  inputWrapper: 'rounded-3xl border-2',
  textarea: 'text-base',
  attachButton: 'hover:bg-gray-100 rounded-full',
  sendButton: 'rounded-full',
  sendButtonActive: 'bg-blue-600 hover:bg-blue-700',
  sendButtonDisabled: 'bg-gray-300 cursor-not-allowed',
  stopButton: 'bg-red-600 hover:bg-red-700',
  supportToggle: 'hover:bg-amber-50',
  supportBadge: 'bg-amber-100 text-amber-800',
  attachmentsContainer: 'rounded-xl bg-gray-50',
  attachmentItem: 'hover:bg-gray-100 transition-colors',
  attachmentThumbnail: 'rounded-lg',
  attachmentRemove: 'hover:bg-red-100 hover:text-red-600',
  suggestionsDropdown: 'rounded-2xl shadow-xl',
  suggestionItem: 'px-4 py-3',
  suggestionItemSelected: 'bg-blue-50 dark:bg-blue-900/20',
  contextLink: 'text-blue-600 hover:text-blue-700',
}

const inputTexts: ChatInputTexts = {
  placeholder: 'Type your message...',
  supportPlaceholder: 'Describe your support request...',
  attachedFiles: 'Attachments',
  attachFiles: 'Add files',
  toggleSupportMode: 'Contact support',
  exitSupportMode: 'Exit support mode',
  supportLabel: 'Support',
}
</script>
```

### ChatMessage Customization

```vue
<template>
  <ChatMessage
    :message="msg"
    :ui="messageUI"
    :texts="messageTexts"
  />
</template>

<script setup lang="ts">
import type { ChatMessageUI, ChatMessageTexts } from '@doderasoftware/restify-ai'

const messageUI: ChatMessageUI = {
  root: 'py-4',
  userMessage: 'gap-4',
  userBubble: 'bg-blue-600 rounded-3xl px-5 py-3',
  userAvatar: 'w-10 h-10 rounded-full bg-blue-600',
  assistantMessage: 'gap-4',
  assistantBubble: 'bg-white shadow-sm rounded-3xl px-5 py-4',
  loadingIndicator: 'text-gray-500',
  loadingDots: 'space-x-1.5',
  content: 'prose-lg',
  attachmentsContainer: 'mt-4 grid gap-2',
  attachmentItem: 'rounded-xl p-3',
  actionsContainer: 'mt-2',
  showMoreButton: 'text-blue-300 hover:text-white',
}

const messageTexts: ChatMessageTexts = {
  loadingText: 'Thinking...',
  showMore: 'Read more',
  showLess: 'Show less',
  openAttachment: 'View',
  attachment: 'File',
}
</script>
```

### AiEmptyState Customization

```vue
<template>
  <AiEmptyState
    :ui="emptyStateUI"
    :texts="emptyStateTexts"
  />
</template>

<script setup lang="ts">
import type { AiEmptyStateUI, AiEmptyStateTexts } from '@doderasoftware/restify-ai'

const emptyStateUI: AiEmptyStateUI = {
  root: 'p-8',
  content: 'max-w-5xl',
  header: 'mb-12',
  badge: 'rounded-full bg-blue-100 text-blue-700',
  title: 'text-5xl font-extrabold',
  description: 'text-lg text-gray-500',
  grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  suggestionCard: 'rounded-2xl p-5 hover:shadow-lg transition-shadow',
  suggestionIconContainer: 'w-12 h-12 rounded-xl',
  suggestionIcon: 'w-6 h-6',
  suggestionTitle: 'text-base font-bold',
  suggestionDescription: 'text-sm',
}

const emptyStateTexts: AiEmptyStateTexts = {
  aiName: 'AI Assistant',
  title: 'What can I help you with?',
  description: 'Select a suggestion or ask your own question',
}
</script>
```

### MentionList Customization

```vue
<template>
  <MentionList
    :items="mentionItems"
    :ui="mentionListUI"
  />
</template>

<script setup lang="ts">
import type { MentionListUI } from '@doderasoftware/restify-ai'

const mentionListUI: MentionListUI = {
  root: 'rounded-xl shadow-xl border-2',
  container: 'p-3',
  groupHeader: 'text-xs font-bold uppercase text-gray-400',
  item: 'rounded-lg px-3 py-2.5',
  itemSelected: 'bg-blue-100 dark:bg-blue-900/30',
  itemIcon: 'w-10 h-10 rounded-full',
  itemContent: 'ml-3',
  itemName: 'font-semibold',
  itemSubtitle: 'text-gray-500',
}
</script>
```

---

## Using with i18n

All text props work seamlessly with your i18n library:

```vue
<template>
  <AiChatDrawer
    v-model="isOpen"
    :texts="{
      title: $t('ai.title'),
      newChat: $t('ai.newChat'),
      placeholder: $t('ai.placeholder'),
      closeConfirmTitle: $t('ai.closeConfirmTitle'),
      closeConfirmMessage: $t('ai.closeConfirmMessage'),
      confirmClose: $t('ai.confirmClose'),
      cancel: $t('common.cancel'),
    }"
  />
</template>
```

Or use the global translate function in plugin config:

```typescript
app.use(RestifyAiPlugin, {
  endpoints: { ask: '/api/ai/ask' },
  getAuthToken: () => getToken(),
  translate: (key, params) => i18n.t(`ai.${key}`, params),
})
```

---

## Available Slots

### AiChatDrawer Slots

```vue
<AiChatDrawer v-model="isOpen">
  <!-- Custom header -->
  <template #header="{ quota, isFullscreen, hasHistory, onNewChat, onClose, onMinimize, onToggleFullscreen }">
    <MyCustomHeader :quota="quota" @close="onClose" />
  </template>

  <!-- Custom quota display -->
  <template #quota="{ quota }">
    <span class="custom-quota">{{ quota.remaining }} / {{ quota.limit }}</span>
  </template>

  <!-- Custom empty state -->
  <template #empty-state="{ suggestions, onClick }">
    <MyEmptyState :suggestions="suggestions" @select="onClick" />
  </template>

  <!-- Custom message rendering -->
  <template #message="{ message, isUser, isLoading, isStreaming }">
    <MyMessage :message="message" :is-mine="isUser" />
  </template>

  <!-- Custom input -->
  <template #input="{ modelValue, sending, disabled, onSubmit, onCancel }">
    <MyInput v-model="modelValue" :sending="sending" @submit="onSubmit" />
  </template>

  <!-- Custom setup mode content -->
  <template #setup>
    <MySetupWizard />
  </template>

  <!-- Context link below input -->
  <template #context-link>
    <a href="/docs" class="text-xs">View documentation</a>
  </template>
</AiChatDrawer>
```

### ChatInput Slots

```vue
<ChatInput v-model="message">
  <!-- Custom context link -->
  <template #context-link>
    <button @click="showContext">Learn more</button>
  </template>
</ChatInput>
```

### MentionList Slots

```vue
<MentionList :items="items">
  <!-- Custom item icon -->
  <template #item-icon="{ item, type }">
    <img v-if="item.avatar" :src="item.avatar" class="w-8 h-8 rounded-full" />
    <span v-else class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
      {{ item.name?.charAt(0) }}
    </span>
  </template>
</MentionList>
```
