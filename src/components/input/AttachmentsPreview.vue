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
          >
          <IconDocument
            v-else
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(file.size) }}
          </p>
          <div
            v-if="file.uploading"
            class="mt-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-primary transition-all"
              :style="{ width: `${file.progress ?? 10}%` }"
            />
          </div>
        </div>
        <span
          v-if="file.uploading"
          class="text-xs text-gray-400"
        >
          {{ Math.round(file.progress ?? 0) }}%
        </span>
        <button
          type="button"
          class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="ui.attachmentRemove"
          :disabled="file.uploading"
          @click="$emit('remove', file.id)"
        >
          <IconClose class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { IconDocument, IconClose } from '../icons'
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
