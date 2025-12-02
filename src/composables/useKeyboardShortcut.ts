import { onMounted, onUnmounted, ref } from 'vue'
import { getConfigValue } from '../config'

export interface UseKeyboardShortcutOptions {
  shortcut?: string | null
  onToggle: () => void
  enabled?: boolean
}

// Parse shortcut string like "cmd+g", "ctrl+k", "meta+shift+p"
function parseShortcut(shortcut: string): { key: string; meta: boolean; ctrl: boolean; shift: boolean; alt: boolean } {
  const parts = shortcut.toLowerCase().split('+')
  const key = parts.pop() || ''
  
  return {
    key,
    meta: parts.includes('cmd') || parts.includes('meta') || parts.includes('command'),
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt') || parts.includes('option'),
  }
}

function matchesShortcut(event: KeyboardEvent, shortcut: ReturnType<typeof parseShortcut>): boolean {
  const eventKey = event.key.toLowerCase()
  
  // Check modifier keys
  const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey
  const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey
  const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
  const altMatch = shortcut.alt ? event.altKey : !event.altKey
  
  // For cross-platform, treat cmd+key and ctrl+key as equivalent if only one is specified
  let modifierMatch = metaMatch && ctrlMatch && shiftMatch && altMatch
  
  // Special case: if only meta OR ctrl is required, accept either
  if ((shortcut.meta && !shortcut.ctrl) || (!shortcut.meta && shortcut.ctrl)) {
    modifierMatch = (event.metaKey || event.ctrlKey) && shiftMatch && altMatch
  }
  
  return eventKey === shortcut.key && modifierMatch
}

export function useKeyboardShortcut(options: UseKeyboardShortcutOptions) {
  const { onToggle, enabled = true } = options
  const isActive = ref(false)
  
  // Get shortcut from config or options, default to cmd+g
  const shortcutString = options.shortcut !== undefined 
    ? options.shortcut 
    : (getConfigValue('keyboardShortcut') ?? 'cmd+g')
  
  // If shortcut is explicitly null, disable keyboard shortcut
  if (shortcutString === null) {
    return { isActive }
  }
  
  const parsedShortcut = parseShortcut(shortcutString)
  
  function handleKeyDown(event: KeyboardEvent) {
    if (!enabled) return
    
    // Ignore if typing in an input/textarea (unless it's our own AI input)
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    const isContentEditable = target.isContentEditable
    const isAiInput = target.closest('[data-ai-input]')
    
    if ((isInput || isContentEditable) && !isAiInput) return
    
    if (matchesShortcut(event, parsedShortcut)) {
      event.preventDefault()
      event.stopPropagation()
      isActive.value = !isActive.value
      onToggle()
    }
  }
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown, true)
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown, true)
  })
  
  return { isActive }
}

// Export a simple hook for opening/closing the drawer
export function useAiDrawerShortcut(drawerRef: { value: boolean }) {
  return useKeyboardShortcut({
    onToggle: () => {
      drawerRef.value = !drawerRef.value
    }
  })
}
