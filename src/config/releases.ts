interface StableRelease {
  version: string;
  channel: 'Stable';
  platform: 'Windows';
  architecture: 'x64';
  repository: string;
  latest: string;
  changelog: string;
  installer: string;
}

const version = '0.2.1';
const repository = 'https://github.com/Sinisterzs/NEXUS';

export const release = {
  version,
  channel: 'Stable',
  platform: 'Windows',
  architecture: 'x64',
  repository,
  latest: `${repository}/releases/tag/v${version}`,
  changelog: `${repository}/releases`,
  installer: `${repository}/releases/download/v${version}/nexus_${version}_x64-setup.exe`,
} as const satisfies StableRelease;
