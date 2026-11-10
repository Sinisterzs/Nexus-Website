export interface ScreenshotAsset {
  src: `/screenshots/${string}.png`;
  webp: `/screenshots/optimized/${string}.webp`;
  smallWebp: `/screenshots/optimized/${string}.webp`;
  width: number;
  height: number;
}

export type ThemeId = 'dark' | 'midnight' | 'cyber';
export interface AppScreenshot {
  id: 'home' | 'messages' | 'call' | 'settings';
  label: string;
  alt: string;
  theme: ThemeId | null;
  asset: ScreenshotAsset | null;
}

function asset(name: string, optimized = name): ScreenshotAsset {
  return {
    src: `/screenshots/nexus-${name}.png`,
    webp: `/screenshots/optimized/nexus-${optimized}-1920.webp`,
    smallWebp: `/screenshots/optimized/nexus-${optimized}-960.webp`,
    width: 1920,
    height: 1045,
  };
}

// Actual captures inspected before use. No generated or recolored UI images.
export const screenshots: AppScreenshot[] = [
  {id:'home',label:'Home',alt:'Home real do NEXUS Desktop com conversas recentes e lista de amigos',theme:'dark',asset:asset('home')},
  {id:'messages',label:'Mensagens',alt:'Tela real de mensagens do NEXUS Desktop com lista de conversas e conversa aberta',theme:'cyber',asset:asset('messages')},
  {id:'call',label:'Chamadas',alt:'Chamada real do NEXUS Desktop com compartilhamento de tela e controles de voz no tema NEXUS Dark',theme:'dark',asset:asset('calls')},
  {id:'settings',label:'Configurações',alt:'Configurações reais do NEXUS Desktop com perfil e preferências da conta',theme:'cyber',asset:asset('settings')},
];

export const themeScreenshots = [
  {id:'dark',label:'NEXUS Dark',color:'#b8495a',alt:'Home real do NEXUS Desktop no tema NEXUS Dark, com acentos carmesim',asset:asset('dark','home')},
  {id:'midnight',label:'Midnight Black',color:'#6187ff',alt:'Home real do NEXUS Desktop no tema Midnight Black, com acentos azuis',asset:asset('midnight')},
  {id:'cyber',label:'Cyber Slate',color:'#45bdcc',alt:'Home real do NEXUS Desktop no tema Cyber Slate, com acentos ciano',asset:asset('cyber')},
] as const;

// Home and NEXUS Dark PNGs are byte-identical: their WebP derivative is shared.
