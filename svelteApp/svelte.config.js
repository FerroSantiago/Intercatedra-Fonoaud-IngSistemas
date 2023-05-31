import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			paths: {
				base: '/intercatedra-fonoaud-ing-sistemas/'
			}
		})
	}
};

export default config;
