import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	server: {
		port: 5174,
		fs: {
			allow: ['..']
		}
	},

	ssr: {
		noExternal: ['gsap']
	},

	build: {
		target: 'esnext',
		
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				passes: 2,
				pure_funcs: ['console.log', 'console.info', 'console.debug']
			},
			mangle: {
				safari10: true
			},
			format: {
				comments: false
			}
		},

		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('three') || id.includes('troika')) {
						return 'three-vendor';
					}

					if (id.includes('gsap')) {
						return 'gsap-vendor';
					}

					if (
						id.includes('lenis') || 
						id.includes('@studio-freight')
					) {
						return 'scroll-vendor';
					}

					if (id.includes('@threlte')) {
						return 'threlte-vendor';
					}

					if (id.includes('matter-js') || id.includes('matter')) {
						return 'physics-vendor';
					}

					if (id.includes('html2canvas')) {
						return 'canvas-vendor';
					}

					if (id.includes('motion') || id.includes('framer-motion')) {
						return 'motion-vendor';
					}

					if (id.includes('lucide')) {
						return 'icons-vendor';
					}

					return undefined;
				}
			}
		},

		chunkSizeWarningLimit: 1000,
		sourcemap: false,
		cssCodeSplit: true
	},

	optimizeDeps: {
		include: ['gsap', '@studio-freight/lenis'],
		exclude: ['@sveltejs/kit']
	},

	esbuild: {
		legalComments: 'none'
	}
});
