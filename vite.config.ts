import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import svgr from "vite-plugin-svgr";

// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Ton-utils/',
  resolve: {
    alias: {
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
    }
  },
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),

    // Allows using self-signed certificates to run the dev server using HTTPS.
    // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    // basicSsl(),
    svgr(),
  ],
  publicDir: './public',
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
  },
  css:{
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});

