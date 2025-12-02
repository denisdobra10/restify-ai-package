<template>
  <div 
    class="border border-gray-200 dark:border-gray-700 rounded-2xl p-3 bg-gray-50 dark:bg-gray-800 space-y-3"
    :class="ui.attachmentsContainer"
  >
    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {{ texts?.attachedFiles || 'Attached files' }}
    </p>
    <ul class="space-y-2">
      <li
        v-for="file in attachments"
        :key="file.id"
        class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-700 p-2 shadow-sm border border-gray-100 dark:border-gray-600"
        :class="ui.attachmentItem"
      >
        <div 
          class="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-600 overflow-hidden"
          :class="ui.attachmentThumbnail"
        >
          <img
            v-if="isImage(file)"
            :src="file.previewUrl || file.url"
            class="object-cover h-full w-full"
            alt=""
          />
          <svg v-else class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(file.size) }}
          </p>
          <div v-if="file.uploading" class="mt-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all" :style="{ width: `${file.progress ?? 10}%` }" />
          </div>
        </div>
        <span v-if="file.uploading" class="text-xs text-gray-400">
          {{ Math.round(file.progress ?? 0) }}%
        </span>
        <button
          type="button"
          class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="ui.attachmentRemove"
          :disabled="file.uploading"
          @click="$emit('remove', file.id)"
        >
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ChatAttachment, ChatInputUI, ChatInputTexts } from '../../types'

interface UploadingAttachment extends ChatAttachment {
  uploading?: boolean
  progress?: number
  previewUrl?: string
}

interface Props {
  attachments: UploadingAttachment[]
  ui: ChatInputUI
  texts?: ChatInputTexts
  isImage: (file: UploadingAttachment) => boolean
  formatFileSize: (size?: number | string) => string
}

defineProps<Props>()

defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>
