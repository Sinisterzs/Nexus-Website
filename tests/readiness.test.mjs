import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

test('Cloudflare exige SITE_URL sem presumir domínio público',()=>{
  const result=spawnSync(process.execPath,['--input-type=module','-e',"await import('./astro.config.mjs')"],{env:{...process.env,SITE_URL:'',CF_PAGES:'1'},encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/Configure SITE_URL/);
});
test('configuração aceita origem explícita e rejeita URL com caminho',()=>{
  const run=url=>spawnSync(process.execPath,['--input-type=module','-e',"const {default:c}=await import('./astro.config.mjs');console.log(c.site)"],{env:{...process.env,SITE_URL:url,CF_PAGES:'1'},encoding:'utf8'});
  const good=run('https://example.invalid');assert.equal(good.status,0);assert.match(good.stdout,/https:\/\/example.invalid/);
  assert.notEqual(run('https://example.invalid/path').status,0);
});
test('legendas e acento editorial mantêm contraste AA em superfícies escuras',()=>{
  const css=readFileSync('src/styles/polish.css','utf8');
  const get=name=>css.match(new RegExp(`--${name}:(#[a-f0-9]{6})`))[1];
  const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  for(const token of ['muted','caption','caption-accent'])for(const background of ['#090a0d','#111318','#1b1e25'])assert.ok(contrast(get(token),background)>=4.5,`${token} sobre ${background}`);
});
