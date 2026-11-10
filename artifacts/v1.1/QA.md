# NEXUS Website v1.1 — entrega e validação

10/11/2026. Atualização incremental; stack, hero, Signal Core, identidade carmesim e demonstração Svelte preservados. Nenhum deploy, release ou alteração no aplicativo desktop.

## Alterações

- **v0.2.1 Stable / Windows x64**: objeto tipado único, URLs derivadas, tag específica e dois CTAs conferidos.
- Remoção de `®` no header e footer.
- Microtextos com mais contraste e tamanhos mínimos revistos; tokens de legendas cumprem AA sobre as três superfícies escuras.
- Menu com Escape, foco devolvido ao botão, clique externo e fechamento ao navegar. Header com estado discreto de rolagem.
- Três temas e abas preservados; transições canceláveis e curtas.
- Signal Core: mesma geometria/paleta, cursor amortecido, cerca de 30fps, DPR máximo 1.5 desktop / 1.25 mobile, pausa fora da viewport e tratamento de contexto perdido.
- Galeria condicional de capturas reais, configuração de quatro telas, dimensões preservadas e lazy loading; nenhum placeholder apresentado como imagem real.
- PNG Open Graph 1200×630, Twitter Card completo e `SITE_URL` obrigatório no build Cloudflare. Sem domínio público presumido.

## Arquivos modificados/criados

```text
astro.config.mjs
package.json
package-lock.json
README.md
src/config/{releases,screenshots}.ts
src/layouts/Base.astro
src/components/layout/Header.astro
src/components/interactive/AppPreview.svelte
src/components/sections/Screenshots.astro
src/pages/index.astro
src/lib/{signal,motion}.ts
src/styles/{fonts,polish}.css
public/assets/og.png
public/assets/screenshots/README.md
scripts/{check-distribution,check-dist,check-links,qa-server}.mjs
tests/{distribution,readiness}.test.mjs
artifacts/QA.md
artifacts/links.json
artifacts/performance-before.json
artifacts/v1.1/*
```

## Testes e produção

`npm run build` aprovado: **7 testes**, validação de distribuição, Astro check (**0 erros, 0 avisos, 0 hints**) e build estático. Após o último ajuste de CSS, build e verificador do HTML executados novamente com sucesso.

Testes: centralização Stable; detecção de versão antiga; URLs duplicadas; slots e assets de screenshots; SITE_URL obrigatório na Cloudflare; validação da origem; contraste dos tokens. Verificador do HTML: versão, dois CTAs, âncoras, ausência de ®, assets, PNG 1200×630 e SEO.

Saídas: `/index.html`, `/robots.txt`, `/sitemap.xml` e assets estáticos. Sem backend.

### Links oficiais

HEAD com redirects: **HTTP 200 nos quatro destinos** — repositório, tag v0.2.1, instalador `nexus_0.2.1_x64-setup.exe` e histórico de releases/changelog. Respostas completas em `../links.json`. Não se baixou/executou nem se verificou o conteúdo binário do instalador.

## Navegador

Medidas finais do build real, em `responsive.json`:

| Viewport | clientWidth | scrollWidth |
| --- | --- | --- |
| 360 | 345 | 345 |
| 390 | 375 | 375 |
| 768 | 753 | 753 |
| 1024 | 1009 | 1009 |
| 1440 | 1425 | 1425 |
| 1920 | 1905 | 1905 |

Sem overflow horizontal nos seis tamanhos. A diferença de 15px é a barra vertical do navegador. Hero, recursos, aplicativo, CTA final e footer inspecionados em desktop/mobile; capturas abaixo.

Executado: navegação por âncoras; menu abre, Escape fecha e devolve foco, seleção de link fecha; estado do header durante rolagem; os três temas; Home, Personalização e retorno a Mensagens. Tab chegou ao botão Home com outline sólido de 2px. CTAs apontam para o instalador configurado. Console observado sem erros ou warnings, inclusive nos fallbacks.

### Signal Core e fallbacks executados

`scripts/qa-server.mjs` serve o mesmo build compilado com condições controladas, sem entrar em `dist/`:

| Cenário | Resultado observado |
| --- | --- |
| Normal | Canvas criado, estado `running`, núcleo renderizado |
| Rolagem até Aplicativo | Canvas fora da tela em estado `paused` |
| Sem WebGL | getContext indisponível no harness; estado `unavailable`, sem canvas anexado, fallback com opacidade 1 |
| Movimento reduzido | matchMedia simulado; estado `reduced-motion`, sem canvas e sem Lenis |
| Contexto perdido | WEBGL_lose_context real disparou evento; estado `context-lost`, canvas com opacidade 0, fallback 1, classe webgl-ready removida |

Limites: reduced-motion foi simulado na API JavaScript, sem alterar preferência do sistema/DevTools; regras CSS nativas foram revisadas, sem emulação CSS específica. O cenário sem aceleração foi coberto pela indisponibilidade do contexto: não se alterou a aceleração do navegador nem se testou GPU integrada física. Pausa com aba oculta e bfcache revisadas no código, sem simulação nativa de visibilidade. Sem auditoria formal por leitor de tela ou Lighthouse.

## Desempenho

Tamanhos dos arquivos locais; gzip de referência, não métricas de rede:

| Recurso | Antes | v1.1 |
| --- | --- | --- |
| JS total sem compressão | 144.760 B | 149.375 B |
| JS total gzip | 50.842 B | 52.667 B |
| Fontes emitidas | 266.452 B / 10 arquivos | 70.544 B / 2 arquivos |

JS gzip aumentou 1.825 B pelos tratamentos adicionais. Lenis passou a chunk dinâmico apenas no desktop com ponteiro preciso e movimento permitido; Svelte continua `client:visible`; galeria não exige hidratação. Fontes emitidas caíram 73,5%, removendo subconjuntos não usados. Isso não implica a mesma redução no download inicial, pois antes havia unicode-range. Dados completos em `performance.json`. Sem benchmark físico de GPU ou métricas de LCP/INP/CLS em produção.

## Capturas

- [Hero desktop](desktop-hero.jpg) e [mobile](mobile-hero.jpg).
- [Aplicativo desktop](desktop-app.jpg) e [mobile](mobile-app.jpg).
- [Recursos desktop](desktop-resources.jpg) e [mobile](mobile-resources.jpg).
- [Download e footer](desktop-download.jpg).
- [Página completa desktop](desktop-full.jpg) e [mobile](mobile-full.jpg).
- [Sem WebGL](fallback-no-webgl.jpg), [movimento reduzido simulado](fallback-reduced.jpg) e [contexto perdido](fallback-context-lost.jpg).

## Pendências e publicação

Capturas reais autorizadas ainda não foram fornecidas; preencher as quatro entradas de `src/config/screenshots.ts` quando disponíveis. A demonstração continua explicitamente ilustrativa.

Definir `SITE_URL` com o endereço real da Cloudflare antes da publicação. Sem ele, o build local é noindex e usa localhost; no ambiente Cloudflare, falha para impedir metadados provisórios.

Quando desejar publicar: conectar o repositório do website ao Pages, framework Astro, comando `npm run build`, saída `dist`, `NODE_VERSION=24` e `SITE_URL` real. README contém o procedimento completo. Nenhum deploy foi executado.
