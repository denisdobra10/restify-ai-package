# Future Improvements for @doderasoftware/restify-ai

This document outlines recommended features and improvements that would make the package more powerful and flexible for different use cases.

---

## 1. Animation System

### Current State
The drawer uses CSS transitions but no Vue transition component wrapper.

### Recommendation
Add Vue `<Transition>` wrapper with customizable animation classes:

```ts
interface RestifyAiAnimations {
  drawerEnter?: string
  drawerLeave?: string
  messageEnter?: string
  overlayFade?: string
}
```

**Features:**
- Slide animation for drawer (slide-left enter/leave)
- Fade-in slide-up for messages (`animate-in fade-in slide-in-from-bottom-2`)
- Optional overlay backdrop with fade
- Configurable animation duration

---

## 2. Fullscreen Mode

### Current State
Package has `isFullscreen` in store but drawer doesn't use it visually.

### Recommendation
Add fullscreen toggle button in header and support responsive widths:

```ts
interface DrawerSizeConfig {
  default: string  // e.g., 'w-[600px]'
  fullscreen: string  // e.g., 'w-[90vw]'
  maxWidth?: string  // e.g., 'max-w-5xl'
}
```

**Features:**
- Toggle fullscreen button in header
- Responsive width classes
- Center content in fullscreen mode with max-width

---

## 3. Minimize/Hide Behavior

### Current State
Only close button exists.

### Recommendation
Add minimize button that keeps conversation state but hides the drawer:

```ts
interface DrawerControls {
  showClose?: boolean
  showMinimize?: boolean
  showFullscreen?: boolean
  onMinimize?: () => void
}
```

---

## 4. Chat History Limit Warning Dialog

### Current State
Store checks limit but only logs error.

### Recommendation
Add confirmation dialog when approaching or reaching chat history limit:

```ts
interface HistoryLimitConfig {
  limit: number
  showWarningAt?: number  // e.g., limit - 2
  onLimitReached?: () => Promise<boolean>  // return true to start new chat
  warningMessage?: string
  limitMessage?: string
}
```

**Features:**
- Show warning when approaching limit
- Modal confirmation when limit reached
- Option to start new chat or continue

---

## 5. Dynamic Loading Text

### Current State
Static loading text ("Gathering data...").

### Recommendation
Progressive loading messages that change during response:

```ts
interface LoadingTextConfig {
  messages: string[]  // Array of messages to cycle through
  intervals: number[]  // Delay for each message
}

// Example:
loadingMessages: [
  'Gathering data...',      // 0s
  'Analyzing...',           // 2s
  'Crafting a response...', // 5s
]
```

---

## 6. ESC Key Handling

### Current State
No keyboard handling for drawer close.

### Recommendation
Add ESC key to minimize drawer (not close with confirmation):

```ts
interface KeyboardConfig {
  toggleShortcut?: string | null  // e.g., 'mod+g'
  closeShortcut?: string | null   // e.g., 'escape'
  closeAction?: 'minimize' | 'close'  // minimize = hide, close = with confirmation
}
```

---

## 7. Suggestion Filtering with Fuzzy Search

### Current State
Basic text matching for suggestions.

### Recommendation
Smart filtering that ignores stop words and uses fuzzy matching:

```ts
interface SuggestionFilterConfig {
  stopWords?: string[]  // Words to ignore in matching
  fuzzyThreshold?: number  // For fuzzy matching library
  maxResults?: number
}
```

**Features:**
- Ignore common words ("a", "the", "and", etc.)
- Word-by-word matching
- All query words must appear in suggestion

---

## 8. Mention Data Stores Integration

### Current State
Mentions require manual data providers.

### Recommendation
Add first-class support for common entity types with configurable stores:

```ts
interface EntityStoreProvider {
  employees?: {
    fetch: () => Promise<MentionItem[]>
    transform?: (item: any) => MentionItem
  }
  jobs?: {
    fetch: () => Promise<MentionItem[]>
    transform?: (item: any) => MentionItem
  }
  candidates?: {
    fetch: () => Promise<MentionItem[]>
    transform?: (item: any) => MentionItem
  }
  projects?: {
    fetch: () => Promise<MentionItem[]>
    transform?: (item: any) => MentionItem
  }
  custom?: Record<string, {
    fetch: () => Promise<MentionItem[]>
    transform?: (item: any) => MentionItem
  }>
}
```

---

## 9. Page Context Auto-Detection

### Current State
Manual `setPageContext` call required.

### Recommendation
Add route watcher to automatically detect context:

```ts
interface PageContextConfig {
  autoDetect?: boolean
  routeMatchers?: {
    pattern: string | RegExp
    context: PageContext
  }[]
  extractFromRoute?: (route: RouteLocationNormalized) => PageContext
}
```

**Features:**
- Watch route changes
- Match patterns to contexts
- Show relevant entities in mention dropdown based on page

---

## 10. Suggestion Icons and Gradients

### Current State
Suggestions have icon/gradient support but limited defaults.

### Recommendation
Expand icon/gradient system with category-based defaults:

```ts
interface SuggestionStyle {
  icon: Component
  gradientClass: string
}

interface CategoryStyles {
  employees: SuggestionStyle
  jobs: SuggestionStyle
  candidates: SuggestionStyle
  projects: SuggestionStyle
  analytics: SuggestionStyle
  settings: SuggestionStyle
  support: SuggestionStyle
}
```

---

## 11. Rich Copy to Clipboard

### Current State
Basic text copy.

### Recommendation
Copy both plain text and HTML to clipboard:

```ts
// ClipboardItem API for rich content
const clipboardItem = new ClipboardItem({
  'text/plain': new Blob([text], { type: 'text/plain' }),
  'text/html': new Blob([html], { type: 'text/html' }),
})
```

---

## 12. Context Link (Settings Integration)

### Current State
No link to AI context settings.

### Recommendation
Add slot and configurable link for company/AI context settings:

```ts
interface ContextLinkConfig {
  show?: boolean
  href?: string
  text?: string
  routerLink?: boolean  // Use router-link instead of <a>
}
```

---

## 13. Quota Exceeded Flow

### Current State
Basic quota display and support mode toggle.

### Recommendation
Complete flow when quota reaches 0:

```ts
interface QuotaExceededConfig {
  showContactButton?: boolean
  contactButtonText?: string
  onContactSupport?: () => void
  autoEnableSupportMode?: boolean
  customComponent?: Component
}
```

**Features:**
- Contact Support button appears when quota = 0
- Clicking enables support mode and pre-fills prompt
- Option to upgrade or contact for more quota

---

## 14. Notification System Integration

### Current State
Uses console.warn for errors.

### Recommendation
Add notification callbacks for user feedback:

```ts
interface NotificationConfig {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
  onInfo?: (message: string) => void
}
```

**Use cases:**
- File upload success/failure
- Copy to clipboard success
- Quota warnings
- Network errors

---

## 15. Form Integration (FormKit Support)

### Current State
Uses raw textarea.

### Recommendation
Optional FormKit wrapper for better form integration:

```ts
interface FormConfig {
  useFormKit?: boolean
  formKitSection?: string
  validationRules?: Record<string, any>
}
```

---

## 16. Drag & Drop Overlay Visual

### Current State
Basic drag state tracking.

### Recommendation
Visual overlay when dragging files:

```ts
interface DragDropConfig {
  showOverlay?: boolean
  overlayText?: string
  overlayIcon?: Component
  acceptedTypesText?: string
}
```

---

## 17. Mobile Responsive Design

### Current State
Fixed width drawer.

### Recommendation
Full mobile responsiveness:

```ts
interface ResponsiveConfig {
  mobileBreakpoint?: number
  mobileFullscreen?: boolean
  mobileAnimation?: string
  swipeToClose?: boolean
}
```

**Features:**
- Full screen on mobile
- Swipe to close gesture
- Different animations for mobile
- Larger touch targets

---

## 18. Message Reactions/Feedback

### Current State
Only copy action.

### Recommendation
Add feedback buttons (thumbs up/down):

```ts
interface FeedbackConfig {
  enabled?: boolean
  options?: ('copy' | 'thumbsUp' | 'thumbsDown' | 'regenerate')[]
  onFeedback?: (messageId: string, type: string) => void
}
```

---

## 19. Message Regeneration

### Current State
No regenerate option.

### Recommendation
Allow regenerating assistant responses:

```ts
interface RegenerateConfig {
  enabled?: boolean
  buttonText?: string
  onRegenerate?: (messageId: string) => Promise<void>
}
```

---

## 20. Export Chat History

### Current State
Session-only storage.

### Recommendation
Export chat to various formats:

```ts
interface ExportConfig {
  enabled?: boolean
  formats?: ('json' | 'markdown' | 'pdf' | 'txt')[]
  onExport?: (format: string, data: ChatMessage[]) => void
}
```

---

## 21. Multi-Model Support

### Current State
Single AI endpoint.

### Recommendation
Support multiple AI providers/models:

```ts
interface ModelConfig {
  models?: {
    id: string
    name: string
    endpoint: string
    icon?: Component
  }[]
  defaultModel?: string
  showModelSelector?: boolean
  onModelChange?: (modelId: string) => void
}
```

---

## 22. Voice Input Support

### Current State
Text-only input.

### Recommendation
Add voice input via Web Speech API:

```ts
interface VoiceInputConfig {
  enabled?: boolean
  language?: string
  continuous?: boolean
  onTranscript?: (text: string) => void
  onError?: (error: Error) => void
}
```

---

## 23. Typing Indicator for Streaming

### Current State
Loading dots only.

### Recommendation
Better streaming visualization:

```ts
interface StreamingConfig {
  showTypingCursor?: boolean
  chunkDelay?: number  // For smoother animation
  streamingIndicator?: 'dots' | 'cursor' | 'pulse' | 'none'
}
```

---

## 24. Message Search

### Current State
No search in history.

### Recommendation
Search through chat history:

```ts
interface SearchConfig {
  enabled?: boolean
  minChars?: number
  highlightMatches?: boolean
  searchInAttachments?: boolean
}
```

---

## 25. Plugin System for Extensions

### Current State
Callbacks and hooks.

### Recommendation
Formal plugin architecture:

```ts
interface RestifyAiPlugin {
  name: string
  install: (context: PluginContext) => void
  hooks?: {
    beforeSend?: BeforeSendHook
    afterResponse?: AfterResponseHook
    onMessage?: (message: ChatMessage) => void
  }
  components?: Record<string, Component>
}
```

---

## Priority Recommendations

### High Priority (Core UX)
1. **Animation System** - Professional polish
2. **Fullscreen Mode** - Essential for long conversations
3. **Chat History Limit Dialog** - Prevent data loss
4. **ESC Key Handling** - Standard UX pattern
5. **Notification Integration** - User feedback

### Medium Priority (Enhanced Features)
6. **Dynamic Loading Text** - Better perceived performance
7. **Rich Clipboard Copy** - Professional output
8. **Page Context Auto-Detection** - Better mention suggestions
9. **Mobile Responsive Design** - Modern requirement
10. **Quota Exceeded Flow** - Complete business logic

### Lower Priority (Nice to Have)
11. **Voice Input** - Accessibility
12. **Message Search** - Power users
13. **Export History** - Enterprise feature
14. **Multi-Model Support** - Future proofing
15. **Plugin System** - Extensibility

---

## Implementation Notes

1. All features should be opt-in via configuration
2. Maintain backward compatibility
3. Keep bundle size minimal - lazy load heavy features
4. Ensure TypeScript types are complete for all new options
5. Add tests for each new feature
6. Document with examples in README

---

*This document should be updated as features are implemented and new needs are identified.*
