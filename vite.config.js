import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
              'resources/css/app.css',
              'resources/js/src/pages/OpenSketch.ts',
              'resources/js/src/pages/SketchManager.ts',
            ],
            refresh: true,
        }),
    ],
});
