import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Only VITE_* variables reach the browser bundle, and the bundle is public:
// never expose server secrets here (e.g. via `define`).
export default defineConfig({
    server: {
        port: 3000,
        host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
        }
    }
});
