import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { RestifyAiPlugin } from '@doderasoftware/restify-ai'
import type { MentionProvider, SuggestionProvider, AISuggestion } from '@doderasoftware/restify-ai'

// Import package styles
import '@doderasoftware/restify-ai/styles'

// Import Tailwind styles
import './style.css'

const app = createApp(App)

app.use(createPinia())

// Example mention providers (like Growee has for employees, jobs, candidates, projects)
const mentionProviders: MentionProvider[] = [
    {
        type: 'employee',
        label: 'Employees',
        priority: 10,
        search: async (query) => {
            // In real app, this would call your API
            const mockEmployees = [
                { id: '1', name: 'John Doe', type: 'employee', attributes: { email: 'john@example.com' } },
                { id: '2', name: 'Jane Smith', type: 'employee', attributes: { email: 'jane@example.com' } },
            ]
            return mockEmployees.filter(e =>
                e.name.toLowerCase().includes(query.toLowerCase())
            )
        },
        getDisplayName: (item) => item.name || item.attributes?.name || 'Unknown',
        getSubtitle: (item) => item.attributes?.email || null,
    },
    {
        type: 'project',
        label: 'Projects',
        priority: 5,
        search: async (query) => {
            const mockProjects = [
                { id: '1', name: 'Website Redesign', type: 'project' },
                { id: '2', name: 'Mobile App', type: 'project' },
            ]
            return mockProjects.filter(p =>
                p.name?.toLowerCase().includes(query.toLowerCase())
            )
        },
    },
]

// Example suggestion providers
const suggestionProviders: SuggestionProvider[] = [
    {
        id: 'dashboard',
        routes: ['/dashboard*'],
        priority: 10,
        getSuggestions: () => [
            {
                id: 'overview',
                title: 'Show Overview',
                description: 'Get a summary of your dashboard',
                prompt: 'Give me an overview of the current dashboard data',
                category: 'analytics',
            },
        ],
    },
]

// Default suggestions shown on empty state
const defaultSuggestions: AISuggestion[] = [
    {
        id: 'help',
        title: 'How can you help?',
        description: 'Learn what I can do for you',
        prompt: 'What can you help me with?',
        category: 'support',
    },
    {
        id: 'analyze',
        title: 'Analyze my data',
        description: 'Get insights from your information',
        prompt: 'Can you analyze my data and provide insights?',
        category: 'analytics',
    },
    {
        id: 'report',
        title: 'Generate a report',
        description: 'Create summaries and reports',
        prompt: 'Generate a report of recent activity',
        category: 'analytics',
    },
]

// Configure RestifyAiPlugin with full options
app.use(RestifyAiPlugin, {
    // Core API Configuration
    // baseUrl is optional - use it when your API is on a different domain or you want
    // to switch between dev/staging/prod easily
    // baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',

    endpoints: {
        ask: '/api/ai/ask',
        quota: '/api/ai/quota',
        uploadFile: '/api/ai/upload', // Optional: for file upload support
    },

    // Authentication - must return a valid token or null
    getAuthToken: () => {
        // In real app: return localStorage.getItem('token') or call your auth system
        return 'your-auth-token'
    },

    // Custom headers for all requests
    getCustomHeaders: () => ({
        'X-App-Version': '1.0.0',
    }),

    // Providers
    mentionProviders,
    suggestionProviders,
    defaultSuggestions,

    // Labels customization (all can be customized)
    labels: {
        aiName: 'AI Assistant',
        emptyStateTitle: 'How can I help you today?',
        emptyStateDescription: 'Ask me anything or select a suggestion below',
        quotaRemaining: '{count} questions left',
    },

    // Features
    keyboardShortcut: 'cmd+g', // or 'ctrl+k', or null to disable
    enableSupportMode: true,

    // Limits
    chatHistoryLimit: 20,
    maxAttachments: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedFileTypes: 'image/*,.pdf,.txt,.doc,.docx',

    // Retry configuration
    retry: {
        maxRetries: 2,
        retryDelay: 1000,
        shouldRetry: (error, attempt) => {
            // Don't retry on quota exceeded
            if (error.message.includes('Quota exceeded')) return false
            return attempt < 2
        },
    },

    // Lifecycle callbacks - useful for analytics, logging, custom behavior
    onQuotaFetched: (quota) => {
        console.log('[AI] Quota fetched:', quota)
    },

    onError: (error) => {
        console.error('[AI] Error:', error)
        // You could show a toast notification here
    },

    onMessageSent: (message) => {
        console.log('[AI] Message sent:', message)
    },

    onResponseReceived: (message) => {
        console.log('[AI] Response received:', message)
    },

    onDrawerToggle: (isOpen) => {
        console.log('[AI] Drawer toggled:', isOpen)
    },

    onNewChat: () => {
        console.log('[AI] New chat started')
    },

    // Stream lifecycle hooks
    onStreamStart: () => {
        console.log('[AI] Stream started')
    },

    onStreamEnd: (fullMessage) => {
        console.log('[AI] Stream ended, full message length:', fullMessage.length)
    },

    onStreamChunk: (chunk) => {
        if (chunk.done) {
            console.log('[AI] Stream complete')
        }
    },

    // Advanced: Modify request before sending
    beforeSend: async (payload) => {
        return {
            ...payload,
            customField: 'custom-value',
            timestamp: Date.now(),
        }
    },

    // File upload callbacks
    onFileUploadStart: (file) => {
        console.log('[AI] Upload started:', file.name)
    },

    onFileUploadProgress: (file, progress) => {
        console.log('[AI] Upload progress:', file.name, progress + '%')
    },

    onFileUploadComplete: (file) => {
        console.log('[AI] Upload complete:', file.name)
    },

    onFileUploadError: (file, error) => {
        console.error('[AI] Upload failed:', file.name, error)
    },
})

app.mount('#app')
