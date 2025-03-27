import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
 
export default ({ mode }) => {
  return defineConfig({
    plugins: [ 
      react(),
     EnvironmentPlugin('all')],
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: '@root-entry-name: default;',
        },
      },
    },
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        "./runtimeConfig": "./runtimeConfig.browser",
        "@": path.resolve(__dirname, 'src'),
       },
    },
  });
};
