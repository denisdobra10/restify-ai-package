import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getConfigValue, getRestifyAiConfig } from '../config'
import { useRestifyAiStore } from '../store'
import type { ChatAttachment, MentionItem, MentionProvider } from '../types'
import { detectMentionContext, getActiveMentionProviders } from './useMentionParsing'

interface UploadingAttachment extends ChatAttachment {
    uploading?: boolean
    progress?: number
    previewUrl?: string
}

/**
 * Composable for handling file attachments in chat input
 */
export function useFileAttachments() {
    const store = useRestifyAiStore()
    const attachments = ref<UploadingAttachment[]>([])
    const isDraggingFiles = ref(false)
    const dragItemCounter = ref(0)

    const maxAttachments = getConfigValue('maxAttachments') || 5
    const maxFileSize = getConfigValue('maxFileSize') || 10 * 1024 * 1024
    const acceptedFileTypes = getConfigValue('acceptedFileTypes') || 'image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv'

    const hasAttachments = computed(() => attachments.value.length > 0)
    const isUploading = computed(() => attachments.value.some(a => a.uploading))
    const canAddMore = computed(() => attachments.value.length < maxAttachments)

    function isImage(file: UploadingAttachment): boolean {
        const type = file.type || ''
        if (type.startsWith('image/')) return true
        return /(png|jpe?g|gif|webp)$/i.test(file.name)
    }

    function formatFileSize(size?: number | string): string {
        if (size === undefined || size === null) return ''
        const value = typeof size === 'string' ? parseInt(size, 10) : size
        if (Number.isNaN(value)) return ''
        if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`
        if (value >= 1024) return `${Math.round(value / 1024)} KB`
        return `${value} B`
    }

    function addLocalFile(file: File) {
        const id = crypto.randomUUID()
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        const config = getRestifyAiConfig()
        const hasUploadEndpoint = !!config?.endpoints?.uploadFile

        const attachment: UploadingAttachment = {
            id,
            name: file.name,
            type: file.type,
            size: file.size,
            uploading: hasUploadEndpoint,
            progress: hasUploadEndpoint ? 0 : 100,
            previewUrl,
        }

        attachments.value.push(attachment)

        // If upload endpoint is configured, upload the file
        if (hasUploadEndpoint) {
            uploadFileToServer(file, id)
        }
    }

    async function uploadFileToServer(file: File, attachmentId: string) {
        try {
            const result = await store.uploadFile(file)
            const index = attachments.value.findIndex(a => a.id === attachmentId)

            if (index === -1) return

            if (result) {
                // Keep the original previewUrl for images
                const existingPreview = attachments.value[index].previewUrl
                attachments.value[index] = {
                    ...attachments.value[index],
                    id: result.id || attachmentId,
                    url: result.url,
                    extractedText: result.extractedText,
                    uploading: false,
                    progress: 100,
                    previewUrl: existingPreview || result.previewUrl,
                }
            } else {
                // Upload failed, remove attachment
                removeAttachment(attachmentId)
            }
        } catch {
            removeAttachment(attachmentId)
        }
    }

    function removeAttachment(id: string) {
        const index = attachments.value.findIndex(a => a.id === id)
        if (index === -1) return
        const [removed] = attachments.value.splice(index, 1)
        if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
    }

    function clearAttachments() {
        attachments.value.forEach(a => {
            if (a.previewUrl) URL.revokeObjectURL(a.previewUrl)
        })
        attachments.value = []
    }

    function buildPayload(): ChatAttachment[] {
        return attachments.value
            .filter(a => !a.uploading)
            .map(a => ({
                id: a.id,
                name: a.name,
                url: a.url,
                type: a.type,
                size: a.size,
            }))
    }

    function processFiles(fileList: FileList | File[] | null) {
        if (!fileList) return

        const items = Array.from(fileList)
        for (const file of items) {
            if (attachments.value.length >= maxAttachments) break
            if (file.size > maxFileSize) continue
            addLocalFile(file)
        }
    }

    // Drag and drop handlers
    function hasFiles(event: DragEvent): boolean {
        return Array.from(event.dataTransfer?.types || []).includes('Files')
    }

    function handleDragEnter(event: DragEvent) {
        if (!hasFiles(event)) return
        dragItemCounter.value += 1
        isDraggingFiles.value = true
    }

    function handleDragOver(event: DragEvent) {
        if (!hasFiles(event)) event.preventDefault()
    }

    function handleDragLeave(event: DragEvent) {
        if (!hasFiles(event)) return
        dragItemCounter.value = Math.max(0, dragItemCounter.value - 1)
        if (dragItemCounter.value === 0) isDraggingFiles.value = false
    }

    function handleDrop(event: DragEvent) {
        if (!hasFiles(event)) return
        dragItemCounter.value = 0
        isDraggingFiles.value = false
        processFiles(event.dataTransfer?.files || null)
    }

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement
        const files = target.files
        if (files && files.length) processFiles(files)
        target.value = ''
    }

    // Cleanup on unmount
    onBeforeUnmount(() => {
        clearAttachments()
    })

    return {
        // State
        attachments,
        isDraggingFiles,

        // Computed
        hasAttachments,
        isUploading,
        canAddMore,
        acceptedFileTypes,

        // Utils
        isImage,
        formatFileSize,

        // Actions
        removeAttachment,
        clearAttachments,
        buildPayload,
        processFiles,
        handleFileSelect,

        // Drag & Drop
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    }
}

/**
 * Composable for handling mentions in chat input
 */
export function useMentionInput(
    getValue: () => string,
    setValue: (value: string) => void,
    getTextarea: () => HTMLTextAreaElement | null
) {
    const showMentions = ref(false)
    const mentionItems = ref<MentionItem[]>([])
    const selectedMentionIndex = ref(0)
    const mentionContext = ref({ inMention: false, query: '', startPos: 0 })
    const skipNextCheck = ref(false)
    const insertedMentions = ref<{ id: string; name: string; type?: string; metadata?: Record<string, any> | null }[]>([])

    const mentionProviders = computed<MentionProvider[]>(() => {
        const config = getRestifyAiConfig()
        return config?.mentionProviders || []
    })

    function checkForMentions(text: string) {
        if (skipNextCheck.value) { skipNextCheck.value = false; return }
        const textarea = getTextarea()
        if (!textarea) return

        const cursorPos = textarea.selectionStart
        const context = detectMentionContext(text, cursorPos)
        mentionContext.value = context

        if (context.inMention && context.query.length >= 0) {
            searchMentions(context.query)
        } else {
            showMentions.value = false
            mentionItems.value = []
        }
    }

    async function searchMentions(query: string) {
        const providers = getActiveMentionProviders()
        if (providers.length === 0) {
            showMentions.value = false
            return
        }

        const results: MentionItem[] = []

        for (const provider of providers) {
            try {
                const items = await provider.search(query)
                results.push(...items.map(item => ({ ...item, type: provider.type })))
            } catch (e) {
                console.warn(`Mention provider ${provider.type} failed:`, e)
            }
        }

        mentionItems.value = results.slice(0, 10)
        showMentions.value = results.length > 0
        selectedMentionIndex.value = 0
    }

    function handleMentionSelect(item: MentionItem) {
        const { startPos } = mentionContext.value
        const currentValue = getValue()
        const textarea = getTextarea()
        const before = currentValue.slice(0, startPos)
        const after = currentValue.slice(textarea?.selectionStart || startPos)

        const displayName = item.name || item.label || item.title || item.id
        skipNextCheck.value = true
        setValue(`${before}@${displayName} ${after}`)

        insertedMentions.value.push({
            id: item.id,
            name: displayName,
            type: item.type,
            metadata: item.attributes,
        })

        showMentions.value = false
        mentionItems.value = []

        // Focus and set cursor position
        setTimeout(() => {
            const ta = getTextarea()
            ta?.focus()
            const newPos = before.length + displayName.length + 2
            ta?.setSelectionRange(newPos, newPos)
        }, 0)
    }

    function handleMentionKeyDown(evt: KeyboardEvent): boolean {
        if (!showMentions.value || mentionItems.value.length === 0) {
            return false
        }

        if (evt.key === 'ArrowDown') {
            evt.preventDefault()
            selectedMentionIndex.value = Math.min(selectedMentionIndex.value + 1, mentionItems.value.length - 1)
            return true
        }
        if (evt.key === 'ArrowUp') {
            evt.preventDefault()
            selectedMentionIndex.value = Math.max(selectedMentionIndex.value - 1, 0)
            return true
        }
        if (evt.key === 'Enter' || evt.key === 'Tab') {
            evt.preventDefault()
            const selected = mentionItems.value[selectedMentionIndex.value]
            if (selected) handleMentionSelect(selected)
            return true
        }
        if (evt.key === 'Escape') {
            evt.preventDefault()
            showMentions.value = false
            return true
        }

        return false
    }

    function clearMentions() {
        insertedMentions.value = []
    }

    function getMentions() {
        return [...insertedMentions.value]
    }

    return {
        // State
        showMentions,
        mentionItems,
        selectedMentionIndex,
        mentionProviders,

        // Actions
        checkForMentions,
        handleMentionSelect,
        handleMentionKeyDown,
        clearMentions,
        getMentions,
    }
}

/**
 * Composable for handling suggestions dropdown in chat input
 */
export function useInputSuggestions<T extends { id: string; title: string; description: string }>(
    getSuggestions: () => T[],
    getHasHistory: () => boolean,
    getIsFocused: () => boolean,
    getValue: () => string,
    onSelect: (suggestion: T) => void
) {
    const showSuggestions = ref(false)
    const selectedIndex = ref(-1)
    const dropdownRef = ref<HTMLElement | null>(null)

    function scrollIntoView() {
        setTimeout(() => {
            const dropdown = dropdownRef.value
            if (!dropdown) return
            const selected = dropdown.querySelector(`li:nth-child(${selectedIndex.value + 1})`) as HTMLElement
            if (selected) {
                selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            }
        }, 0)
    }

    function handleSuggestionKeyDown(evt: KeyboardEvent): boolean {
        const suggestions = getSuggestions()
        if (!showSuggestions.value || suggestions.length === 0) {
            return false
        }

        if (evt.key === 'ArrowDown') {
            evt.preventDefault()
            selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.length - 1)
            scrollIntoView()
            return true
        }
        if (evt.key === 'ArrowUp') {
            evt.preventDefault()
            selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
            scrollIntoView()
            return true
        }
        if (evt.key === 'Enter' && selectedIndex.value >= 0) {
            evt.preventDefault()
            const selected = suggestions[selectedIndex.value]
            if (selected) handleClick(selected)
            return true
        }
        if (evt.key === 'Escape') {
            evt.preventDefault()
            showSuggestions.value = false
            selectedIndex.value = -1
            return true
        }

        return false
    }

    function handleClick(suggestion: T) {
        onSelect(suggestion)
        showSuggestions.value = false
        selectedIndex.value = -1
    }

    function updateVisibility() {
        const value = getValue()
        const hasHistory = getHasHistory()
        const isFocused = getIsFocused()
        const suggestions = getSuggestions()

        if (value && !hasHistory && isFocused && suggestions.length > 0) {
            showSuggestions.value = true
        } else {
            showSuggestions.value = false
        }
    }

    function hide() {
        showSuggestions.value = false
        selectedIndex.value = -1
    }

    return {
        showSuggestions,
        selectedSuggestionIndex: selectedIndex,
        dropdownRef,
        handleSuggestionKeyDown,
        handleSuggestionClick: handleClick,
        updateSuggestionsVisibility: updateVisibility,
        hideSuggestions: hide,
    }
}

/**
 * Composable for textarea auto-resize
 */
export function useTextareaResize(
    getTextarea: () => HTMLTextAreaElement | null,
    maxHeight: number = 300
) {
    function adjust() {
        const textarea = getTextarea()
        if (!textarea) return

        textarea.style.height = 'auto'
        const nextHeight = Math.min(textarea.scrollHeight, maxHeight)
        textarea.style.height = `${nextHeight}px`
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }

    onMounted(() => {
        setTimeout(adjust, 0)
    })

    return {
        adjustTextareaHeight: adjust,
    }
}
