import { computed, type Ref } from 'vue'
import type { AISuggestion } from '../types'

const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
])

export interface MappedSuggestion {
    id: string
    title: string
    description: string
}

export function useSuggestionFilter(
    suggestions: Ref<AISuggestion[]>,
    query: Ref<string>,
    maxResults = 5
) {
    function filterByQuery(rawQuery: string, allSuggestions: AISuggestion[]): AISuggestion[] {
        if (!rawQuery) return allSuggestions

        const queryWords = rawQuery
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(word => !STOP_WORDS.has(word))

        if (queryWords.length === 0) return allSuggestions

        return allSuggestions.filter(suggestion => {
            const searchText = `${suggestion.title} ${suggestion.description || ''}`.toLowerCase()
            return queryWords.every(word => searchText.includes(word))
        })
    }

    const filteredSuggestions = computed<MappedSuggestion[]>(() => {
        const allSuggestions = suggestions.value || []
        const rawQuery = query.value.toLowerCase().trim()

        return filterByQuery(rawQuery, allSuggestions)
            .slice(0, maxResults)
            .map(s => ({
                id: s.id,
                title: s.title,
                description: s.description || '',
            }))
    })

    return {
        filteredSuggestions,
    }
}
