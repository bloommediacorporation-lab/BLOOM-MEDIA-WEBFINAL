import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
    server: {
        port: 5174, // Run on a different port to avoid conflict with main app
        fs: {
            // Allow serving files from one level up to the project root
            allow: ['..']
        }
    },
    resolve: {
        alias: {
            // '@legacy': path.resolve('../src'),
            // '$lib': path.resolve('../src/lib')
        }
    },
    ssr: {
        noExternal: ['gsap']
    }
});
