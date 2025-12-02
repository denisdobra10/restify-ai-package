import { ref, onUnmounted } from 'vue'
import { getLabel } from '../config'
import type { LoadingTextConfig } from '../types'

/**
 * Composable for managing dynamic loading text during AI responses
 */
export function useLoadingText(
  getSending: () => boolean,
  getConfig?: () => LoadingTextConfig | undefined
) {
  const loadingMessage = ref(getLabel('loadingText'))
  let loadingTextTimers: number[] = []

  function getDefaultMessages(): string[] {
    return [
      getLabel('loadingText'),
      getLabel('analyzingText'),
      getLabel('craftingText'),
    ]
  }

  function getDefaultIntervals(): number[] {
    return [0, 2000, 5000]
  }

  function clearTimers() {
    loadingTextTimers.forEach(timer => clearTimeout(timer))
    loadingTextTimers = []
  }

  function reset() {
    clearTimers()
    const config = getConfig?.()
    const messages = config?.messages ?? getDefaultMessages()
    loadingMessage.value = messages[0] || getLabel('loadingText')
  }

  function start() {
    clearTimers()
    
    const config = getConfig?.()
    const messages = config?.messages ?? getDefaultMessages()
    const intervals = config?.intervals ?? getDefaultIntervals()
    
    // Set first message immediately
    loadingMessage.value = messages[0] || getLabel('loadingText')
    
    // Schedule subsequent messages
    let cumulativeDelay = 0
    for (let i = 1; i < messages.length; i++) {
      cumulativeDelay += intervals[i] || 2000
      const messageIndex = i
      const timer = window.setTimeout(() => {
        if (getSending()) {
          loadingMessage.value = messages[messageIndex]
        }
      }, cumulativeDelay)
      loadingTextTimers.push(timer)
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    clearTimers()
  })

  return {
    loadingMessage,
    startLoadingText: start,
    resetLoadingText: reset,
    clearLoadingTextTimers: clearTimers,
  }
}
