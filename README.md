# NEXUS // SIGNAL — Website v1.1

Landing page estática do NEXUS Desktop, independente do aplicativo. A atualização v1.1 preserva Astro 7, Svelte 5, TypeScript, Anime.js v4, OGL/GLSL, Lenis e a identidade carmesim. Nenhum backend, autenticação, função Cloudflare ou serviço de produção é necessário.

## Instalação e desenvolvimento

Requer Node.js 22.23.4+ e npm (Node 24 pode ser usado no build da Cloudflare).

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Astro, normalmente `http://127.0.0.1:4321`.

```sh
npm test
npm run check:distribution
npm run check
npm run build
npm run preview
```

O build executa testes, valida distribuição, verifica tipos, gera `dist/` e verifica o HTML produzido. Não consulta a API GitHub; funciona sem acesso à API quando as dependências já estão instaladas. O lockfile fixa a resolução das dependências. Em ambientes restritos, desative a telemetria com `ASTRO_TELEMETRY_DISABLED=1` (PowerShell: `$env:ASTRO_TELEMETRY_DISABLED='1'`).

## Stack e organização

Astro 7.4.8, Svelte 5.57.3, integração Svelte 9.1.2, TypeScript 6.0.3, Anime.js 4.5.0, OGL 1.0.11 e Lenis 1.3.27. Não foram adicionadas dependências nesta atualização.

```text
src/config/releases.ts        versão Stable e todos os links de distribuição
src/config/screenshots.ts     quatro slots para capturas reais
src/components/layout/        header desktop/mobile
src/components/sections/      recursos da landing page
src/components/interactive/   apresentação real e interativa em Svelte
src/components/visual/        Signal Core e fallback CSS
src/layouts/Base.astro        SEO, fontes e documento
src/lib/                      animação, rolagem e WebGL
src/pages/                    landing, robots e sitemap estáticos
src/styles/                   tokens, fontes, layout e polimento v1.1
public/assets/og.png           Open Graph 1200 × 630
public/screenshots/           capturas reais e derivados WebP
public/assets/licenses/       licenças SIL OFL das fontes
scripts/                      validações e servidor local de QA
tests/                       regressões de distribuição e preparação de publicação
artifacts/v1.1/               relatório e capturas da versão refinada
```

Space Grotesk e Inter permanecem auto-hospedadas em WOFF2. Apenas os subconjuntos Latin usados em português são emitidos. Fontes, imagens e scripts não dependem de CDN.

## Distribuição Stable

`src/config/releases.ts` é a única fonte de versão, plataforma e URLs. O site está configurado para **v0.2.1 Stable, Windows x64**. Tag e nome do instalador derivam da versão, evitando divergência entre componentes e impedindo que `/releases/latest` passe a anunciar um canal diferente.

Para atualizar, altere a versão nesse arquivo e verifique o nome real do asset publicado. Rode `npm test` e `npm run build`: os testes detectam versões antigas e URLs de releases duplicadas nos componentes. O verificador pós-build também confere os dois CTAs de download, âncoras, imagem OG, marca sem `®` e metadados.

Verificação remota opcional, separada do build:

```sh
node scripts/check-links.mjs
```

Ela usa HEAD (não baixa o instalador), registra resultados em `artifacts/links.json` e falha se algum link não responder com sucesso. Na validação v1.1, GitHub, release Stable, instalador e histórico de releases responderam HTTP 200.

## Capturas reais — Preview 2.0

A seção Aplicativo usa os PNGs reais de `public/screenshots/`, com os quatro painéis reais: Home, Mensagens, Chamadas e Configurações. Os três temas alternam as capturas reais da Home; as outras telas preservam suas cores originais. A prévia tem navegação por abas com setas, Home/End, foco visível e movimento reduzido, além de links aos PNGs em tamanho original.

As sete capturas disponíveis têm 1920 × 1045 px. WebP desktop lossless preserva todos os pixels; variantes de 960px atendem telas menores. A proporção da moldura é reservada, as imagens não são cortadas e apenas a tela selecionada é montada, com lazy loading. O relatório de verificação e screenshots estão em `artifacts/preview-2.0/QA.md`.

Para atualizar imagens, consulte `public/screenshots/README.md` e `src/config/screenshots.ts`; regenere derivados com `node scripts/optimize-screenshots.mjs`. A antiga galeria paralela e o mockup ilustrativo foram removidos desta seção. A landing page restante foi preservada.

## Motion e acessibilidade

Signal Core preserva geometria e cores. A resposta ao ponteiro usa amortecimento; toque não move o núcleo. DPR máximo 1.5 no desktop e 1.25 no mobile, renderização limitada a aproximadamente 30fps. O canvas pausa fora da viewport e com a página oculta. Falta de WebGL/aceleração adequada, movimento reduzido e perda de contexto usam composição CSS estática. Após perda de contexto, não se reutilizam recursos inválidos nem se recarrega a página.

Lenis é importado dinamicamente apenas com ponteiro preciso, viewport desktop e movimento permitido. Toque e teclado mantêm navegação nativa. Mudanças de preferência desativam movimento; hovers e transições são canceláveis. O menu possui estados acessíveis, fechamento por Escape, clique externo e seleção de link. A preferência nativa de movimento reduzido também é respeitada por CSS.

## SITE_URL e publicação na Cloudflare Pages

O endereço público ainda não foi definido. Sem `SITE_URL`, o build local usa `http://localhost:4321`, omite canonical público e marca a página `noindex`. Não há domínio público inventado.

Na Cloudflare, **SITE_URL é obrigatório**: o build falha quando `CF_PAGES=1` e a variável está ausente. Use somente a origem completa, sem caminho ou barra extra: `https://<nome-real-do-projeto>.pages.dev`. URLs com caminho, query ou credenciais são rejeitadas. O valor alimenta canonical, Open Graph, Twitter Card, sitemap e robots.

1. Crie um repositório GitHub separado para este website e envie os arquivos (não use o repositório desktop).
2. No painel Cloudflare: **Workers & Pages → Create application → Pages → Import an existing Git repository**; conecte o repositório do website.
3. Configure framework **Astro**, branch de produção escolhida, build **`npm run build`**, saída **`dist`**, raiz do repositório.
4. Antes de iniciar o deploy, configure `NODE_VERSION=24`, `SITE_URL` com o endereço real atribuído ao projeto e, opcionalmente, `ASTRO_TELEMETRY_DISABLED=1`. Configure os ambientes Production e Preview conforme necessário; previews que compartilham SITE_URL anunciam canonical da produção.
5. Quando você decidir publicar, execute **Save and Deploy** e confira os metadados e o download no endereço real.

Se o endereço ainda não estiver disponível durante a criação, configure-o antes de executar novamente o build. Não é necessário adaptador SSR, domínio pago, VPS, banco de dados ou funções. Nenhum deploy ou release foi criado nesta tarefa.

Referência: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

## Validação e pendências

Veja `artifacts/v1.1/QA.md` para os testes executados, screenshots, métricas de arquivos e limites da verificação. O servidor opcional `node scripts/qa-server.mjs` serve exclusivamente o build local em `127.0.0.1:4323`; `/qa/reduced`, `/qa/no-webgl` e `/qa/lost` são condições controladas de teste. Esse servidor e suas injeções nunca são emitidos em `dist/`.

A publicação existente não é alterada automaticamente. O Preview 2.0 inclui a captura real de Chamadas. Preserve o `SITE_URL` configurado na Cloudflare. Não há medição Lighthouse/Core Web Vitals de produção, teste em hardware físico com GPU integrada nem alteração da aceleração gráfica do navegador. O cenário reduced-motion da automação simula `matchMedia`; não altera a preferência do sistema operacional. A perda de contexto foi provocada pela extensão WebGL real do navegador.

