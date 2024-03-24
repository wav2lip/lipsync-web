import { defineConfig } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'

import { vitePluginForArco } from '@arco-plugins/vite-vue'

import UnoCSS from 'unocss/vite'
import { transformerDirectives } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		}
	},

	plugins: [
		vue(),

		// https://github.com/arco-design/arco-plugins/tree/main/packages/plugin-vite-vue
		vitePluginForArco({
			style: 'css'
		}),

		// https://unocss.dev/integrations/vite
		UnoCSS({
			// 配置项
			// presets: [
			// ],
			rules: [
				['test', { display: 'flex', }],
			],
			shortcuts: {
				'flex-center': 'flex justify-center items-center',
				'flex-col-center': 'flex flex-col justify-center items-center',
			},
			transformers: [
				transformerDirectives(),
			]
		}),

	],
})
