import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import sharp from 'sharp';
import {screenshots,themeScreenshots} from '../src/config/screenshots.ts';

test('os quatro painéis usam capturas reais, incluindo Chamadas',()=>{
  assert.equal(screenshots.find(item=>item.id==='call').asset.src,'/screenshots/nexus-calls.png');
  assert.equal(screenshots.find(item=>item.id==='call').theme,'dark');
  assert.equal(screenshots.filter(item=>item.asset).length,4);
});
test('temas são capturas distintas; Home e NEXUS Dark compartilham derivativo idêntico',()=>{
  assert.deepEqual(themeScreenshots.map(item=>item.id),['dark','midnight','cyber']);
  assert.ok(readFileSync('public/screenshots/nexus-home.png').equals(readFileSync('public/screenshots/nexus-dark.png')));
  assert.equal(screenshots[0].asset.webp,themeScreenshots[0].asset.webp);
  const buffers=themeScreenshots.map(item=>readFileSync(`public${item.asset.src}`));
  assert.ok(!buffers[0].equals(buffers[1])&&!buffers[1].equals(buffers[2]));
});
test('WebP desktop preserva os pixels originais e reduz bytes; variante mobile mantém proporção',async()=>{
  const unique=new Map([...screenshots,...themeScreenshots].filter(item=>item.asset).map(item=>[item.asset.webp,item.asset]));
  for(const asset of unique.values()){
    const original=await sharp(`public${asset.src}`).ensureAlpha().raw().toBuffer();
    const optimized=await sharp(`public${asset.webp}`).ensureAlpha().raw().toBuffer();
    assert.ok(original.equals(optimized),`WebP sem alterações de pixels: ${asset.src}`);
    assert.ok(statSync(`public${asset.webp}`).size<statSync(`public${asset.src}`).size);
    const mobile=await sharp(`public${asset.smallWebp}`).metadata();assert.equal(mobile.width,960);assert.ok(Math.abs(mobile.height-asset.height/2)<=1);
  }
});
