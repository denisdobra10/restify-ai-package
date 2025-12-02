import { type Ref, nextTick, onUnmounted } from 'vue'

export interface UseChatScrollReturn {
  scrollToBottom: (container?: HTMLElement | null) => void
  setupAutoScroll: (container: HTMLElement) => void
  cleanupAutoScroll: () => void
}

/**
 * Chat Scroll Composable
 */
export function useChatScroll(): UseChatScrollReturn {
  let observer: MutationObserver | null = null

  function scrollToBottom(container?: HTMLElement | null): void {
    const target = container || document.querySelector('[data-rai-chat-container]') as HTMLElement
    if (!target) return

    requestAnimationFrame(() => {
      target.scrollTo({
        top: target.scrollHeight,
        behavior: 'smooth',
      })
    })
  }

  function isNearBottom(container: HTMLElement, threshold = 100): boolean {
    const { scrollTop, scrollHeight, clientHeight } = container
    return scrollHeight - scrollTop - clientHeight < threshold
  }

  function setupAutoScroll(container: HTMLElement): void {
    if (!container) return

    cleanupAutoScroll()

    observer = new MutationObserver(() => {
      if (container.scrollTop === 0 || isNearBottom(container)) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          })
        })
      }
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
    })
  }

  function cleanupAutoScroll(): void {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onUnmounted(() => {
    cleanupAutoScroll()
  })

  return {
    scrollToBottom,
    setupAutoScroll,
    cleanupAutoScroll,
  }
}
