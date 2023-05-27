import vue from '@vitejs/plugin-vue2';
import { type LibraryFormats, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import Inspect from 'vite-plugin-inspect';


const entry = './src/main.ts';
const formats: LibraryFormats[] = ['es', 'cjs'];

export default defineConfig({
    plugins: [
        vue(),
        Inspect(),
        dts({
            staticImport: true,
            outputDir: 'dist/types'
        }),
    ],
    build: {
        target: 'es2015',
        lib: {
            entry,
            formats
        },
        rollupOptions: {
            external: [
                'vue',
            ],
            input: [entry],
            output: formats.map(format => ({
                format,
                entryFileNames: '[name].[format].js',
                exports: 'named'
            }))
        }
    }
});
