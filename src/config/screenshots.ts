export interface AppScreenshot {
  id: 'home' | 'messages' | 'call' | 'personalization';
  label: string;
  alt: string;
  asset: { src: `/assets/screenshots/${string}`; width: number; height: number } | null;
}

// Add only authorized captures of the real Stable application; never mockups.
export const screenshots: AppScreenshot[] = [
  {id:'home',label:'Tela inicial',alt:'Tela inicial do NEXUS Desktop',asset:null},
  {id:'messages',label:'Mensagens',alt:'Conversas e mensagens no NEXUS Desktop',asset:null},
  {id:'call',label:'Chamada',alt:'Interface de chamada de voz do NEXUS Desktop',asset:null},
  {id:'personalization',label:'Personalização',alt:'Seleção dos temas no NEXUS Desktop',asset:null},
];
