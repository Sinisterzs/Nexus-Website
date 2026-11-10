# Capturas reais — Preview 2.0

As sete imagens PNG foram inspecionadas: todas têm **1920 × 1045 px**. PNGs originais preservados.

| Arquivo | Conteúdo |
| --- | --- |
| nexus-home.png | Home no tema NEXUS Dark |
| nexus-messages.png | Mensagens no tema Cyber Slate |
| nexus-settings.png | Configurações no tema Cyber Slate |
| nexus-dark.png | Home NEXUS Dark; idêntica ao arquivo nexus-home.png |
| nexus-midnight.png | Home Midnight Black |
| nexus-cyber.png | Home Cyber Slate |
| nexus-calls.png | Chamada com compartilhamento de tela no tema NEXUS Dark |

`src/config/screenshots.ts` é a fonte de painéis e temas. Os temas alternam capturas da Home. Mensagens, Chamadas e Configurações mantêm a aparência original, sem filtros ou recoloração. O link de tamanho original abre o PNG fornecido.

`optimized/` contém versões WebP 1920px lossless e variantes de 960px com qualidade 92. A versão desktop é comparada pixel a pixel com o PNG pelos testes. Home e NEXUS Dark compartilham um WebP, evitando duplicação. Apenas a imagem selecionada está no DOM; `picture/srcset` escolhe uma resolução, sem preload das demais telas.

Para regenerar após substituir capturas com as mesmas dimensões:

```sh
node scripts/optimize-screenshots.mjs
npm run build
```

A captura de Chamadas foi inspecionada e integrada. Todos os quatro painéis possuem captura real; não há mais aviso de pendência nessa aba.
