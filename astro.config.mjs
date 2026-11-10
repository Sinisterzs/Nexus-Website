import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

const configuredUrl = process.env.SITE_URL;
if (configuredUrl) {
  const parsed = new URL(configuredUrl);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.pathname !== '/' || parsed.search || parsed.hash || parsed.username || parsed.password) {
    throw new Error('SITE_URL deve ser a origem HTTP(S) do site, sem caminho, credenciais ou query.');
  }
}
if (!configuredUrl && process.env.CF_PAGES === '1') {
  throw new Error('Configure SITE_URL com o endereço definitivo do projeto Pages antes de publicar.');
}

export default defineConfig({
  site: configuredUrl || 'http://localhost:4321',
  output: 'static',
  integrations: [svelte()],
  devToolbar: { enabled: false },
});
