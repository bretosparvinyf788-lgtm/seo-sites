import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';

const useCloudflare = process.env.CF_PAGES === '1' || process.env.ASTRO_ADAPTER === 'cloudflare';

export default defineConfig({
  site: 'https://kakobuyworks.com',
  output: 'server',
  adapter: useCloudflare ? cloudflare() : node({ mode: 'standalone' }),
  trailingSlash: 'always',
  vite: {
    server: {
      allowedHosts: ['terminal.local']
    }
  }
});
