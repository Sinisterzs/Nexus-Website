import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {release} from '../src/config/releases.ts';
import {screenshots,themeScreenshots} from '../src/config/screenshots.ts';
import {privacyContact} from '../src/config/privacy.ts';

const html=readFileSync('dist/index.html','utf8');
for(const match of html.matchAll(/\bv(\d+\.\d+\.\d+)\b/g))assert.equal(match[1],release.version,'Versão antiga no HTML gerado');
assert.equal((html.matchAll(new RegExp(release.installer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))).toArray().length,2,'CTAs de download devem usar o instalador central');
assert.ok(!html.includes('®'),'Marca sem registro confirmado');
assert.ok(html.includes('/assets/og.png'),'OG raster obrigatório');
for(const href of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${href[1]}"`),`Âncora ausente: ${href[1]}`);
for(const item of [...screenshots,...themeScreenshots])if(item.asset)for(const path of [item.asset.src,item.asset.webp,item.asset.smallWebp])assert.ok(existsSync(`dist${path}`),`Captura ausente: ${path}`);
assert.ok(html.includes('CAPTURA REAL'),'Apresentação deve identificar as capturas reais');
assert.ok(!html.includes('Prévia ilustrativa'),'Mockup antigo não deve permanecer na apresentação');
const png=readFileSync('dist/assets/og.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
const canonical=html.match(/rel="canonical" href="([^"]+)"/);
if(process.env.SITE_URL){assert.ok(canonical,'Canonical obrigatório em produção');assert.equal(new URL(canonical[1]).origin,new URL(process.env.SITE_URL).origin);}
else assert.ok(html.includes('noindex, nofollow'),'Preview sem URL deve ser noindex');
const privacy=readFileSync('dist/privacidade/index.html','utf8');
assert.ok(html.includes('href="/privacidade/"'),'Footer deve incluir a política de privacidade');
assert.ok(privacy.includes('<title>Política de Privacidade — NEXUS Desktop</title>'),'Título próprio da política');
assert.ok(privacy.includes('NEXUS Desktop — projeto independente'),'Identificação pública confirmada');
for(const href of privacy.matchAll(/href="#([^"]+)"/g))assert.ok(privacy.includes(`id="${href[1]}"`),`Âncora da política ausente: ${href[1]}`);
for(const href of privacy.matchAll(/href="\/#([^"]+)"/g))assert.ok(html.includes(`id="${href[1]}"`),`Navegação da política para a Home inválida: ${href[1]}`);
assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('/privacidade'),'Sitemap deve incluir a política');
assert.ok(privacy.includes(`href="mailto:${privacyContact.email}"`),'Contato oficial deve ter link mailto funcional');
assert.ok(privacy.includes(`>${privacyContact.email}</a>`),'E-mail exibido deve corresponder ao contato oficial');
if(process.env.SITE_URL){
  const value=privacy.match(/rel="canonical" href="([^"]+)"/);
  assert.ok(value,'Canonical da política ausente');
  const address=new URL(value[1]);
  assert.equal(address.origin,new URL(process.env.SITE_URL).origin,'Origem do canonical da política incorreta');
  assert.equal(address.pathname.replace(/\/$/,''),'/privacidade','Caminho do canonical da política incorreto');
}
console.log('HTML, CTAs, âncoras, marca, screenshots, OG 1200×630 e SEO verificados.');
console.log('Política de privacidade, footer, navegação, canonical e sitemap verificados.');
