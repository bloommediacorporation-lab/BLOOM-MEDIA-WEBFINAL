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
		alias: {}
	},
    preprocess: vitePreprocess()
};

export default config;
