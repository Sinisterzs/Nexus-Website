import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { release } from '../src/config/releases.ts';

export function checkDistributionText(text, label) {
  for (const version of text.match(/\bv?\d+\.\d+\.\d+\b/g) || []) {
    if (version.replace(/^v/, '') !== release.version) throw new Error(`${label}: versão desatualizada ${version}`);
  }
  if (/https:\/\/github\.com\/[^\s'"<>]*\/releases/.test(text)) throw new Error(`${label}: use a configuração central de distribuição`);
}
export function checkDistribution() {
  if (release.channel !== 'Stable') throw new Error('A distribuição pública deve usar Stable.');
  const tag = `${release.repository}/releases/tag/v${release.version}`;
  const installer = `${release.repository}/releases/download/v${release.version}/nexus_${release.version}_x64-setup.exe`;
  if (release.latest !== tag || release.installer !== installer) throw new Error('Release e instalador não correspondem à versão Stable.');
  const walk = directory => {
    for (const entry of readdirSync(directory, {withFileTypes:true})) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (/\.(astro|svelte)$/.test(path)) checkDistributionText(readFileSync(path,'utf8'),path);
    }
  };
  walk('src');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {checkDistribution();console.log(`Distribuição consistente: v${release.version} ${release.channel}, Windows ${release.architecture}.`);}
