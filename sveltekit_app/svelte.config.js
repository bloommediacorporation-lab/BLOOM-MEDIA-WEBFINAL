import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'node:fs';
import path from 'node:path';

if (process.platform === 'win32') {
	const originalSymlinkSync = fs.symlinkSync.bind(fs);
	fs.symlinkSync = (target, destPath, type) => {
		try {
			return originalSymlinkSync(target, destPath, type);
		} catch (err) {
			if (!err || err.code !== 'EPERM') throw err;

			const resolvedTarget = path.resolve(path.dirname(destPath), target);
			try {
				const stat = fs.statSync(resolvedTarget);

				fs.rmSync(destPath, { recursive: true, force: true });
				fs.mkdirSync(path.dirname(destPath), { recursive: true });

				if (stat.isDirectory()) {
					return originalSymlinkSync(resolvedTarget, destPath, 'junction');
				}

				fs.copyFileSync(resolvedTarget, destPath);
				return;
			} catch {
				throw err;
			}
		}
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({ runtime: 'nodejs20.x' }),
		alias: {},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline', 'unsafe-eval', 'blob:', 'https://cdn.emailjs.com', 'https://cdn.jsdelivr.net'],
				'worker-src': ['self', 'blob:'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'https:', 'https://i.postimg.cc'],
				'connect-src': ['self', 'https://api.emailjs.com', 'http://localhost:5000']
			}
		}
	},
    preprocess: vitePreprocess()
};

export default config;
