import type { ChatAttachment } from '../types'

/**
 * Check if a file attachment is an image based on MIME type or extension
 */
export function isImageFile(file: ChatAttachment): boolean {
    const type = file.type || ''
    if (type.startsWith('image/')) return true
    return /(png|jpe?g|gif|webp)$/i.test(file.name || '')
}

/**
 * Format file size to human-readable string (B, KB, MB)
 */
export function formatFileSize(size?: number | string): string {
    if (size === undefined || size === null) return ''
    const value = typeof size === 'string' ? parseInt(size, 10) : size
    if (Number.isNaN(value)) return ''

    if (value >= 1024 * 1024) {
        return `${(value / (1024 * 1024)).toFixed(1)} MB`
    }
    if (value >= 1024) {
        return `${Math.round(value / 1024)} KB`
    }
    return `${value} B`
}
