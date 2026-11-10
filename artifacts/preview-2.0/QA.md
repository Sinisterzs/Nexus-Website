## Finalização — Chamadas integrada

A captura `nexus-calls.png` foi adicionada e inspecionada: 1920 × 1045 px, mesma proporção das demais telas, chamada com compartilhamento de tela no tema NEXUS Dark. A entrada `call` agora usa esse arquivo real, sem aviso de pendência. O componente, as animações e os demais painéis foram preservados.

PNG original: 389.429 B; WebP desktop lossless: 239.482 B; mobile 960px: 25.632 B. Teste de igualdade de pixels aprovado. Na inspeção visual há apelidos e avatares; não foram identificados e-mails, telefones, endereços, IPs ou credenciais legíveis na nova imagem. Não se trata de uma imagem anonimizada.

Validação final: 10 testes aprovados, Astro/TypeScript com 0 erros/avisos, `npm run build` aprovado com `SITE_URL=https://nexus-desktop.pages.dev`. Chamadas carregou no navegador em desktop e mobile, sem imagens quebradas, sem aviso de pendência e sem overflow horizontal; `object-fit: contain`, sem cortar a imagem. Console observado sem erros/warnings. As imagens maiores já em cache podem ser reutilizadas no mobile pelo navegador.

Evidências adicionais: [Chamadas desktop](calls-desktop.jpg), [Chamadas mobile](calls-mobile.jpg). A publicação é feita por um único commit de Preview 2.0 enviado à main; o resultado do deploy é confirmado separadamente após o push.

---

**Histórico da primeira revisão, antes da captura de Chamadas:**

# Preview 2.0 — capturas reais

Verificação em 10/11/2026. Alterações limitadas à apresentação do aplicativo, assets, configuração, testes e documentação relacionados. Hero, demais seções, distribuição e configuração da Cloudflare preservados. Nenhum deploy, push ou alteração no NEXUS Desktop.

## Assets inspecionados

Seis PNGs reais, todos **1920 × 1045 px**: Home, Mensagens, Configurações e os três temas. Home e NEXUS Dark são byte a byte idênticos. Mensagens e Configurações foram capturadas em Cyber Slate; seus pixels e cores são mantidos. `nexus-calls.png` está **ausente**.

As abas são Home, Mensagens, Chamadas e Configurações. Chamadas apresenta uma pendência explícita, sem imagem substituta ou requisição para arquivo inexistente. O seletor de temas abre capturas reais da Home; não se supõe que existam capturas de todas as combinações de painel/tema. O texto da seção explica esse comportamento. O mockup e a galeria duplicada foram removidos.

## Otimização

PNGs preservados. Cinco imagens únicas geraram cinco WebPs lossless de 1920px e cinco variantes de 960px (qualidade 92). Home e NEXUS Dark compartilham o mesmo derivativo.

| Imagem | PNG original | WebP desktop | WebP 960px |
| --- | --- | --- | --- |
| Home / Dark | 154.699 B | 88.314 B | 20.162 B |
| Mensagens | 101.686 B | 56.262 B | 13.434 B |
| Configurações | 140.022 B | 79.736 B | 19.208 B |
| Midnight Black | 159.775 B | 89.698 B | 20.802 B |
| Cyber Slate | 154.482 B | 87.590 B | 20.994 B |

Total único: 710.664 B em PNG → 401.600 B em WebP desktop (**43,5% menor**); variantes pequenas somam 94.600 B. Os testes comparam pixels decodificados de PNG e WebP desktop e confirmam igualdade. Nenhum filtro CSS ou recoloração.

`picture/srcset` escolhe a resolução. Apenas a imagem selecionada está no DOM, com lazy loading e dimensões reservadas; não há preload das outras imagens. Na navegação mobile, novas capturas usaram a variante de 960px. Home já carregada em desktop pôde permanecer em cache na resolução maior, comportamento esperado do navegador.

## Resultados

- `npm run build` aprovado: **10 testes passaram**, Astro/TypeScript com **0 erros e 0 avisos**, geração estática e validação do HTML aprovadas.
- Testes adicionais: estado pendente de Chamadas; temas distintos e deduplicação Home/Dark; dimensões dos PNGs; assets presentes; WebP desktop lossless e menor que PNG; proporção das variantes mobile.
- **16 assets HTTP 200**: seis PNGs e dez WebPs, todos com Content-Type correto no servidor de QA. Respostas em `assets.json`.
- Quatro painéis executados em desktop (1440px) e mobile (390px). Todas as imagens selecionadas completaram o carregamento; Chamadas manteve zero imagens no DOM.
- Três temas executados nas duas resoluções. Estado de seleção e caminho real conferidos; `filter:none` confirmado no desktop.
- Moldura estável: área da imagem com **713,53px** de altura em desktop e **181,23px** no mobile, sem alteração entre os quatro painéis.
- Setas direita/esquerda, Home e End executados; seleção e foco acompanharam a navegação, inclusive retorno circular pela seta esquerda.
- Movimento reduzido testado via `matchMedia` simulado no harness local: troca de tema carregada, `style` da imagem ausente, opacidade 1 e `aria-busy=false`. Não se alterou a preferência nativa do sistema operacional.
- Console observado sem erros ou warnings. Nenhuma imagem quebrada observada.

### Responsividade

| Viewport | clientWidth | scrollWidth | Imagem |
| --- | --- | --- | --- |
| 360 | 345 | 345 | contain |
| 390 | 375 | 375 | contain |
| 768 | 753 | 753 | contain |
| 1024 | 1009 | 1009 | contain |
| 1440 | 1425 | 1425 | contain |
| 1920 | 1905 | 1905 | contain |

Sem overflow horizontal. Imagens completas, proporção preservada, sem crop. No mobile, o link de tamanho original permite abrir o PNG e usar a ampliação do navegador. Não houve medição Lighthouse ou de Core Web Vitals do site publicado nesta tarefa.

## Evidências

- [Desktop](desktop.jpg)
- [Mobile](mobile.jpg)
- [Pendência de Chamadas no mobile](mobile-calls-pending.jpg)
- `desktop-panels.json`, `desktop-themes.json`, `mobile-panels.json`, `mobile-themes.json`, `responsive.json` e `assets.json` registram os estados observados.

## Arquivos preparados

`AppPreview.svelte`, `screenshots.ts`, integração da seção em `index.astro`, testes de assets/preview, verificador do build, MIME WebP no servidor local de QA, script de otimização, documentação, seis PNGs originais, dez WebPs e este relatório. `Screenshots.astro` e o README da pasta antiga de screenshots foram removidos por terem sido substituídos pela apresentação única.

## Pendência e entrega Git

Única captura faltante: `public/screenshots/nexus-calls.png`. Quando fornecida, inspecionar dimensões/conteúdo e preencher a entrada `call` com seus derivados e tema real.

Alterações preparadas para um único commit local na branch `main`, sem executar push. O push atualizará a publicação existente da Cloudflare; deve ser feito somente após a revisão do usuário. Não é necessário criar projeto, domínio ou configuração de deploy.
