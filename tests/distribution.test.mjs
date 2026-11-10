import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {checkDistribution,checkDistributionText} from '../scripts/check-distribution.mjs';
import {release} from '../src/config/releases.ts';
import {screenshots,themeScreenshots} from '../src/config/screenshots.ts';

test('Stable, tag, instalador e consumidores usam a configuração central',()=>checkDistribution());
test('regressão: detecta uma versão antiga em um componente',()=>{
  const parts=release.version.split('.').map(Number);parts[2]-=1;
  assert.throws(()=>checkDistributionText(`Baixar v${parts.join('.')}`,'fixture'),/desatualizada/);
});
test('regressão: impede links de release duplicados nos componentes',()=>{
  assert.throws(()=>checkDistributionText(`<a href="${release.latest}">Stable</a>`,'fixture'),/configuração central/);
});
test('capturas reais configuradas existem e possuem dimensões e texto alternativo',()=>{
  assert.deepEqual(screenshots.map(item=>item.id),['home','messages','call','settings']);
  for(const item of [...screenshots,...themeScreenshots]){
    assert.ok(item.alt.trim());
    if(item.asset){
      const {src,webp,smallWebp,width,height}=item.asset;
      assert.ok(width>0&&height>0);
      for(const path of [src,webp,smallWebp]){assert.ok(path.startsWith('/screenshots/'));assert.ok(!path.includes('..'));assert.ok(existsSync(`public${path}`));}
      const png=readFileSync(`public${src}`);assert.equal(png.readUInt32BE(16),width);assert.equal(png.readUInt32BE(20),height);
    }
  }
});
