# Capturas reais pendentes

Adicionar arquivos autorizados de Home, Mensagens, Chamada e Personalização da versão Stable. Preferir WebP ou PNG otimizado, sem distorcer ou reconstruir a interface. Remover dados pessoais antes da captura.

Depois, preencher `asset: {src:'/assets/screenshots/home.webp',width:1920,height:1080}` (usar dimensões reais) no item correspondente de `src/config/screenshots.ts`.

Itens com `asset:null` não aparecem no site. A galeria é adicionada dentro da seção Aplicativo somente quando houver capturas configuradas; a demonstração interativa é preservada. `npm test` detecta caminhos ausentes e dimensões inválidas.
