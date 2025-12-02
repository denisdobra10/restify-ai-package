import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@doderasoftware/restify-ai/styles': resolve(__dirname, '../src/styles/index.css'),
            '@doderasoftware/restify-ai': resolve(__dirname, '../src/index.ts'),
        },
    },
})
