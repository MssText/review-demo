import vue from '@vitejs/plugin-vue2';
import { defineConfig, type LibraryFormats } from 'vite';
import dts from 'vite-plugin-dts';
import Inspect from 'vite-plugin-inspect';

const entry = './src/main.ts';
const formats: LibraryFormats[] = ['es', 'cjs'];

export default defineConfig({
    plugins: [
        vue(),
        dts({
          insertTypesEntry: true,
          outputDir: 'dist/types'
      }),
      Inspect()
    ],
    build: {
      target: 'es2015',
      lib: {
          entry,
          formats
      },
      rollupOptions: {
          external: [
              'react',
              'react-dom',
          ],
          input: [entry],
          output: [
              {
                  format: 'es',
                  entryFileNames: '[name].es.js',
              },
              {
                  format: 'cjs',
                  entryFileNames: '[name].cjs.js',
              }
          ]
      }
  }
});
