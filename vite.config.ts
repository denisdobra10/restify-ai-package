import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            include: ['src/**/*.ts', 'src/**/*.vue'],
            exclude: ['src/**/*.test.ts', 'playground/**/*'],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'RestifyAi',
            formats: ['es', 'umd'],
            fileName: (format) => `restify-ai.${format === 'es' ? 'js' : 'umd.cjs'}`,
        },
        rollupOptions: {
            external: ['vue', 'pinia'],
            output: {
                globals: {
                    vue: 'Vue',
                    pinia: 'Pinia',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') {
                        return 'style.css'
                    }
                    return assetInfo.name || 'assets/[name][extname]'
                },
            },
        },
        cssCodeSplit: false,
    },
})
