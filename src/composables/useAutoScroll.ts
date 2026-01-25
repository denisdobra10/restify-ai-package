import { nextTick, watch, type Ref, type WatchSource } from 'vue'

export function useAutoScroll(containerRef: Ref<HTMLElement | null>) {
    async function scrollToBottom() {
        await nextTick()
        const el = containerRef.value
        if (el) {
            el.scrollTop = el.scrollHeight
        }
    }

    function watchForScroll(
        messageCount: WatchSource<number>,
        messageContent: WatchSource<string>
    ) {
        // Scroll when new messages are added
        watch(messageCount, scrollToBottom)

        // Scroll when streaming content updates
        watch(messageContent, scrollToBottom)
    }

    return {
        scrollToBottom,
        watchForScroll,
    }
}
