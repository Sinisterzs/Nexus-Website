import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {release} from '../src/config/releases.ts';
import {screenshots} from '../src/config/screenshots.ts';

const html=readFileSync('dist/index.html','utf8');
for(const match of html.matchAll(/\bv(\d+\.\d+\.\d+)\b/g))assert.equal(match[1],release.version,'Versão antiga no HTML gerado');
assert.equal((html.matchAll(new RegExp(release.installer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))).toArray().length,2,'CTAs de download devem usar o instalador central');
assert.ok(!html.includes('®'),'Marca sem registro confirmado');
assert.ok(html.includes('/assets/og.png'),'OG raster obrigatório');
for(const href of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${href[1]}"`),`Âncora ausente: ${href[1]}`);
for(const item of screenshots)if(item.asset)assert.ok(existsSync(`dist${item.asset.src}`),`Captura ausente: ${item.asset.src}`);
const png=readFileSync('dist/assets/og.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
const canonical=html.match(/rel="canonical" href="([^"]+)"/);
if(process.env.SITE_URL){assert.ok(canonical,'Canonical obrigatório em produção');assert.equal(new URL(canonical[1]).origin,new URL(process.env.SITE_URL).origin);}
else assert.ok(html.includes('noindex, nofollow'),'Preview sem URL deve ser noindex');
console.log('HTML, CTAs, âncoras, marca, screenshots, OG 1200×630 e SEO verificados.');
