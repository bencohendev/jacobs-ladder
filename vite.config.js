import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'*c': resolve('./src/components'),
			'*stores': resolve('./src/stores'),
			'*lib': resolve('./src/lib')
		}
	}
};

export default config;
