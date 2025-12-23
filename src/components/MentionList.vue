<template>
  <div
    v-if="items.length > 0"
    class="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto z-50"
    :class="ui.root"
  >
    <div
      class="p-2"
      :class="ui.container"
    >
      <template
        v-for="(group, groupType) in groupedItems"
        :key="groupType"
      >
        <!-- Group Header -->
        <div
          v-if="Object.keys(groupedItems).length > 1"
          class="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
          :class="ui.groupHeader"
        >
          {{ getGroupLabel(groupType as string) }}
        </div>

        <!-- Items -->
        <button
          v-for="(item, index) in group"
          :key="item.id"
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-0.5"
          :class="[
            ui.item,
            {
              [ui.itemSelected || 'bg-primary/10']: getFlatIndex(groupType as string, index) === selectedIndex,
              'hover:bg-gray-50 dark:hover:bg-gray-700': getFlatIndex(groupType as string, index) !== selectedIndex,
            }
          ]"
          @click="selectItem(item)"
          @mouseenter="updateSelectedIndex(getFlatIndex(groupType as string, index))"
        >
          <!-- Icon -->
          <slot
            name="item-icon"
            :item="item"
            :type="groupType"
          >
            <span 
              class="w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0"
              :class="[ui.itemIcon, getIconClasses(item.type)]"
            >
              {{ getInitials(getDisplayName(item)) }}
            </span>
          </slot>
          
          <!-- Content -->
          <div
            class="flex-1 min-w-0"
            :class="ui.itemContent"
          >
            <p 
              class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
              :class="ui.itemName"
            >
              {{ getDisplayName(item) }}
            </p>
            <p 
              v-if="getSubtitle(item)" 
              class="text-xs text-gray-500 dark:text-gray-400 truncate"
              :class="ui.itemSubtitle"
            >
              {{ getSubtitle(item) }}
            </p>
          </div>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { MentionItem, MentionProvider, MentionListUI, MentionListTexts } from '../types'
import { getMentionDisplayName, getMentionSubtitle, getMentionProvider } from '../composables/useMentionParsing'

interface Props {
  items: MentionItem[]
  selectedIndex?: number
  providers?: MentionProvider[]
  /** Custom UI classes for styling */
  ui?: MentionListUI
  /** Custom text overrides for i18n support */
  texts?: MentionListTexts
}

const props = withDefaults(defineProps<Props>(), {
  selectedIndex: 0,
  providers: () => [],
})

// UI class helpers
const ui = computed(() => props.ui || {})

interface Emits {
  (e: 'select', item: MentionItem): void
  (e: 'update:selectedIndex', index: number): void
}

const emit = defineEmits<Emits>()

const selectedIndex = ref(props.selectedIndex)

watch(() => props.selectedIndex, (newIndex) => {
  selectedIndex.value = newIndex
})

watch(selectedIndex, (newIndex) => {
  emit('update:selectedIndex', newIndex)
})

const groupedItems = computed(() => {
  const groups: Record<string, MentionItem[]> = {}

  props.items.forEach((item) => {
    const type = item.type || 'default'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(item)
  })

  return groups
})

function getProvider(type: string): MentionProvider | undefined {
  return props.providers.find((p) => p.type === type) || getMentionProvider(type)
}

function getGroupLabel(type: string): string {
  const provider = getProvider(type)
  return provider?.label || type.charAt(0).toUpperCase() + type.slice(1) + 's'
}

function getFlatIndex(groupType: string, indexInGroup: number): number {
  let flatIndex = 0
  const types = Object.keys(groupedItems.value)

  for (const type of types) {
    if (type === groupType) {
      return flatIndex + indexInGroup
    }
    flatIndex += groupedItems.value[type].length
  }

  return flatIndex
}

function selectItem(item: MentionItem): void {
  emit('select', item)
}

function updateSelectedIndex(index: number): void {
  selectedIndex.value = index
  emit('update:selectedIndex', index)
}

function getDisplayName(item: MentionItem): string {
  const provider = getProvider(item.type)
  return getMentionDisplayName(item, provider)
}

function getSubtitle(item: MentionItem): string | null {
  const provider = getProvider(item.type)
  return getMentionSubtitle(item, provider)
}

// Color coding for different mention types
function getIconClasses(type: string): string {
  const colorMap: Record<string, string> = {
    employee: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    job: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    candidate: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    project: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    default: 'bg-primary/10 text-primary',
  }
  
  return colorMap[type] || colorMap.default
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>
