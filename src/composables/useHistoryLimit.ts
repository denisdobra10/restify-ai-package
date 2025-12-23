import { ref, computed } from 'vue'
import type { ChatAttachment, Mention, HistoryLimitConfig, AiChatDrawerTexts } from '../types'

interface HistoryLimitState {
    showWarning: boolean
    isReached: boolean
    pendingMessage: {
        message: string
        attachments: ChatAttachment[]
        mentions: Mention[]
        isSupportRequest?: boolean
    } | null
}

interface UseHistoryLimitOptions {
    getHistoryLength: () => number
    getStoreLimit: () => number
    getConfig: () => HistoryLimitConfig | undefined
    getTexts: () => AiChatDrawerTexts | undefined
    onStartNewChat: () => void
    onNewChatEmit: () => void
}

/**
 * Composable for managing chat history limit warnings and actions
 */
export function useHistoryLimit(options: UseHistoryLimitOptions) {
    const {
        getHistoryLength,
        getStoreLimit,
        getConfig,
        getTexts,
        onStartNewChat,
        onNewChatEmit,
    } = options

    const state = ref<HistoryLimitState>({
        showWarning: false,
        isReached: false,
        pendingMessage: null,
    })

    // Computed values
    const limit = computed(() => getConfig()?.limit ?? getStoreLimit())
    const warningAt = computed(() => getConfig()?.showWarningAt ?? (limit.value - 2))
    const remaining = computed(() => Math.max(0, limit.value - getHistoryLength()))
    const isApproaching = computed(() =>
        remaining.value <= (limit.value - warningAt.value) && remaining.value > 0
    )
    const isAtLimit = computed(() => remaining.value === 0)

    const dialogTitle = computed(() => {
        if (state.value.isReached) {
            return getTexts()?.historyLimitReachedTitle ?? 'Chat Limit Reached'
        }
        return getTexts()?.historyLimitWarningTitle ?? 'Approaching Chat Limit'
    })

    const dialogMessage = computed(() => {
        if (state.value.isReached) {
            return getConfig()?.limitMessage ?? getTexts()?.historyLimitReachedMessage ??
                'You have reached the maximum number of messages in this conversation. Start a new chat to continue.'
        }
        return getConfig()?.warningMessage ?? getTexts()?.historyLimitWarningMessage ??
            `You have ${remaining.value} message${remaining.value === 1 ? '' : 's'} remaining in this conversation.`
    })

    function dismiss() {
        state.value.showWarning = false
        state.value.isReached = false
        state.value.pendingMessage = null
    }

    async function handleAction(): Promise<{
        message: string
        attachments: ChatAttachment[]
        mentions: Mention[]
        isSupportRequest?: boolean
    } | null> {
        state.value.showWarning = false

        // Call custom handler if provided
        const config = getConfig()
        if (config?.onLimitReached) {
            const shouldStartNew = await config.onLimitReached()
            if (!shouldStartNew) {
                state.value.isReached = false
                return null
            }
        }

        // Start new chat
        onStartNewChat()
        onNewChatEmit()
        state.value.isReached = false

        // Return pending message if any
        if (state.value.pendingMessage) {
            const pending = state.value.pendingMessage
            state.value.pendingMessage = null
            return pending
        }

        return null
    }

    /**
     * Check history limit before sending a message
     * @returns true if sending is allowed, false if blocked
     */
    function check(): boolean {
        // Check if at limit
        if (isAtLimit.value) {
            state.value.isReached = true
            state.value.showWarning = true
            return false
        }

        // Check if approaching limit (show warning but allow sending)
        if (isApproaching.value && !state.value.showWarning) {
            state.value.showWarning = true
            // Don't block - just show warning
        }

        return true
    }

    function setPendingMessage(msg: {
        message: string
        attachments: ChatAttachment[]
        mentions: Mention[]
        isSupportRequest?: boolean
    }) {
        state.value.pendingMessage = msg
    }

    return {
        // State
        showHistoryLimitWarning: computed(() => state.value.showWarning),
        historyLimitReached: computed(() => state.value.isReached),

        // Computed
        historyLimit: limit,
        remainingMessages: remaining,
        historyLimitDialogTitle: dialogTitle,
        historyLimitDialogMessage: dialogMessage,

        // Actions
        dismissHistoryLimitWarning: dismiss,
        handleHistoryLimitAction: handleAction,
        checkHistoryLimit: check,
        setPendingMessage,
    }
}
