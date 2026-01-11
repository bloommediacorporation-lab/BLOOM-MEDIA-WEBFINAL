import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import compression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Gzip + Brotli compression for production
		compression({
			verbose: true,
			disable: false,
			threshold: 1024, // Only compress files > 1KB
			algorithm: 'gzip',
			ext: '.gz',
		}),
		compression({
			verbose: true,
			disable: false,
			threshold: 1024,
			algorithm: 'brotli',
			ext: '.br',
		}),
	],
    server: {
        port: 5174,
        fs: {
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
    },
	build: {
		// Optimize build output
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		// Code splitting for better caching
		rollupOptions: {
			output: {
				manualChunks: {
					// 'gsap': ['gsap'],
					// 'lenis': ['@studio-freight/lenis'],
					// 'vendor': ['motion', 'lucide-svelte'],
				},
			},
		},
		// Reduce chunk size warnings
		chunkSizeWarningLimit: 1000,
		// Enable source maps for production debugging
		sourcemap: false,
		// CSS code splitting
		cssCodeSplit: true,
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['gsap', '@studio-freight/lenis', 'motion', '@splinetool/runtime'],
		exclude: ['@sveltejs/kit'],
	},
});
