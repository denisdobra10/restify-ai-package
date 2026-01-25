<template>
  <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
    <IconSparkles class="w-7 h-7 text-primary" />
  </div>
  
  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
    Almost there!
  </h2>
  <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-center">
    Configure the plugin in your app entry file to start using AI.
  </p>
  
  <div class="w-full max-w-md">
    <div class="bg-gray-900 rounded-xl overflow-hidden">
      <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <span class="text-xs text-gray-400">main.ts</span>
        <button 
          type="button"
          class="text-xs text-gray-400 hover:text-white transition-colors"
          @click="$emit('copy')"
        >
          {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
      </div>
      <pre class="text-xs text-gray-100 p-4 overflow-x-auto leading-relaxed"><code class="language-typescript"><span class="text-purple-400">import</span> { RestifyAiPlugin } <span class="text-purple-400">from</span> <span class="text-green-400">'@doderasoftware/restify-ai'</span>

app.<span class="text-yellow-300">use</span>(RestifyAiPlugin, {
  <span class="text-blue-300">endpoints</span>: {
    <span class="text-blue-300">ask</span>: <span class="text-green-400">'/api/ai/ask'</span>,
    <span class="text-blue-300">quota</span>: <span class="text-green-400">'/api/ai/quota'</span>, <span class="text-gray-500">// optional</span>
  },
  <span class="text-blue-300">getAuthToken</span>: () => <span class="text-yellow-300">getToken</span>(),
})</code></pre>
    </div>
    
    <p class="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
      Need help? Check the <a
        href="https://github.com/doderasoftware/restify-ai"
        target="_blank"
        class="text-primary hover:underline"
      >documentation</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconSparkles } from '../icons'

interface Props {
  copied: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'copy'): void
}>()
</script>
