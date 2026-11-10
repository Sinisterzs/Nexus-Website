import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {checkDistribution,checkDistributionText} from '../scripts/check-distribution.mjs';
import {release} from '../src/config/releases.ts';
import {screenshots} from '../src/config/screenshots.ts';

test('Stable, tag, instalador e consumidores usam a configuração central',()=>checkDistribution());
test('regressão: detecta uma versão antiga em um componente',()=>{
  const parts=release.version.split('.').map(Number);parts[2]-=1;
  assert.throws(()=>checkDistributionText(`Baixar v${parts.join('.')}`,'fixture'),/desatualizada/);
});
test('regressão: impede links de release duplicados nos componentes',()=>{
  assert.throws(()=>checkDistributionText(`<a href="${release.latest}">Stable</a>`,'fixture'),/configuração central/);
});
test('capturas reais configuradas existem e possuem dimensões e texto alternativo',()=>{
  assert.deepEqual(screenshots.map(item=>item.id),['home','messages','call','personalization']);
  for(const item of screenshots){assert.ok(item.alt.trim());if(item.asset){assert.ok(item.asset.width>0&&item.asset.height>0);assert.ok(item.asset.src.startsWith('/assets/screenshots/'));assert.ok(!item.asset.src.includes('..'));assert.ok(existsSync(`public${item.asset.src}`));}}
});
