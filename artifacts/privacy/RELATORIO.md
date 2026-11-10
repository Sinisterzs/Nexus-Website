# Política de Privacidade — revisão técnica e pendências

Preparado em 10/11/2026 para revisão do responsável pelo **NEXUS Desktop — projeto independente**.

Finalidade confirmada pelo usuário: fornecer, após revisão e publicação, uma URL oficial para o formulário do **Microsoft Edge/SmartScreen**, acessado por “Relatar que este arquivo é seguro”. Não é cadastro na Microsoft Store. Nenhum formulário Microsoft foi enviado.

## Entrega

- Página estática em `src/pages/privacidade.astro`, acessível na rota `/privacidade`.
- Texto integral em `politica-completa.md`, extraído do HTML de produção para corresponder à página.
- Identidade, fontes e componentes do website preservados. Footer compartilhado com link “Privacidade”; header da política retorna às seções reais da Home.
- Título, descrição, canonical e sitemap próprios. A rota estática gerada é `dist/privacidade/index.html`; canonical com barra final conforme a convenção do Astro.
- Sem e-mail fictício, nome empresarial, placeholders ou seção de pendências no texto da página. As lacunas operacionais constam somente neste relatório.
- Contato oficial confirmado pelo responsável em 10/11/2026: **kelofc1@gmail.com**. A página o apresenta como canal para dúvidas e solicitações relacionadas a dados pessoais, com link `mailto:`. Isso não estabelece prazos de atendimento ou procedimento de exclusão ainda não implementado. Não foi enviado e-mail de teste nem verificada a operação da caixa postal.
- Nenhum push, deploy, commit ou alteração no aplicativo Desktop. A rota pública só deve ser usada no formulário depois da revisão e publicação autorizada.

## Escopo e fonte

Foi auditado em modo estrito de leitura o repositório NEXUS na versão **v0.2.1 (Stable)**, commit **c7e891807777307551b4134faea895e5a085760c**, e comparado integralmente com a versão **v0.3.0-nightly.1 (Beta)**, commit **65bf756**. O checkout do aplicativo Desktop permaneceu sem modificações. Não foram executados deploys, migrações, alterações em PostgreSQL/AWS, exclusão de dados ou consultas a contas reais.

O código comprova caminhos implementados, não a configuração efetiva de servidores em produção, contratos com fornecedores, cópias de backup ou procedimentos administrativos. A página identifica a versão analisada para não fazer afirmações sobre releases futuras.

### Matriz de evidências

Todos os links abaixo estão fixados no commit auditado:

| Tema | Evidência primária | Conclusão utilizada |
| --- | --- | --- |
| Cadastro e sessão local | [auth.rs](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/auth.rs#L442), [credencial](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/auth.rs#L289) | Nome de usuário, e-mail, senha e nome de exibição enviados ao servidor; token de sessão guardado no gerenciador de credenciais do Windows. |
| OAuth Google | [escopos e navegador](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/oauth.rs#L84), [troca no backend](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/google_oauth.rs#L181) | OpenID, e-mail e perfil; fluxo por código/PKCE; backend troca código e valida identidade. |
| Dados retornados pelo Google | [claims](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/google_oauth.rs#L13), [criação/vínculo](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/auth.rs#L250) | Identificador do provedor, e-mail/verificação, nome e foto quando disponíveis; criação ou identificação da conta. |
| PostgreSQL de conta | [schema inicial](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/migrations/0001_initial_schema.sql), [OAuth](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/migrations/0002_google_oauth.sql) | Usuários, e-mail, hash de senha, perfis, hash de token e datas de sessão, vínculo com provedor. |
| Senha | [hash Argon2](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/auth.rs#L62) | Armazenamento de hash, sem declarar ausência de coleta/transmissão da senha de cadastro. |
| PostgreSQL de mensagens | [schema de DM](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/migrations/0004_direct_messages.sql) | Conteúdo, participantes, remetente, datas, edição/exclusão lógica e recibos de entrega/leitura. O servidor recebe texto; não foi prometida E2EE. |
| SQLite | [banco local](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/db.rs#L223), [migração por conta](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/db.rs#L582) | nexus.db com conversas, mensagens, rascunhos/estado de leitura, fila de envio e cache por conta. Não confundir com dados apenas locais: há PostgreSQL remoto. |
| Preferências e histórico | [SettingsRepository](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src/repositories/SettingsRepository.ts#L4), [CallHistoryRepository](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src/repositories/CallHistoryRepository.ts#L20) | Preferências em arquivo/armazenamento local; histórico de chamadas no localStorage, até 100 itens por conta, com função de limpeza utilizada na UI de Chamadas. Não foi atribuído esse histórico ao SQLite. |
| Microfone, tela, câmera | [permissões nativas](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/lib.rs#L137), [captura](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src/services/ScreenCaptureService.ts#L137) | Autorização interna e permissões do sistema; seletor de tela, vídeo sem áudio do sistema; câmera/geolocalização negadas na implementação auditada. |
| STUN/TURN | [handler ICE](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/handlers/webrtc.rs#L38), [sinalização ICE](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/calls.rs#L574) | STUN Google por padrão; TURN opcional conforme configuração do backend; candidatos de rede encaminhados ao participante. Não afirmar P2P obrigatório ou nenhum servidor intermediário. |
| Tailscale | [network.rs](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/network.rs#L345) | Integração de detecção e acesso de rede. Não inferir que todos os usuários/servidores passam pela mesma implantação. |
| GitHub e imagens externas | [updater](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/tauri.conf.json), [perfil](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/models/mod.rs) | Atualizações consultam GitHub; URLs de avatar podem gerar requisições externas. |
| Logs | [login](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/auth.rs#L277), [e-mail em erro](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/auth.rs#L295), [fonte capturada](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src/services/ScreenCaptureService.ts#L226) | Logs podem conter identificadores, nome, e-mail em situações específicas e informação técnica de captura. Não foi afirmado que logs são anônimos. |
| IP e operação | [rate limiter](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/middleware/rate_limit.rs), [tracing HTTP](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/routes/mod.rs#L271) | Uso de IP para limitar tentativas; registros operacionais. Não inferir prazo de guarda de IP/logs em produção. |
| Desvinculação Google | [unlink](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/services/auth.rs#L397) | Exige senha alternativa; desvincular não exclui a conta. |
| Logout | [logout](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/src-tauri/src/auth.rs#L523) | Remove credencial local e tenta revogação remota com timeout. Não apaga banco local/conta. |
| Apagar mensagem | [exclusão lógica](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/repositories/dm.rs#L605) | Substitui conteúdo e marca deleted_at; metadados permanecem. Não comprova eliminação de backups. |
| Exclusão completa da conta | [rotas auditadas](https://github.com/Sinisterzs/NEXUS/blob/c7e891807777307551b4134faea895e5a085760c/nexus-server/src/routes/mod.rs) | Não foi identificado fluxo completo de exclusão de conta pelo usuário ou de purga de todos os dados/backups. Não foi inventado um procedimento. |

## Exatamente o que ainda precisa de confirmação do responsável

1. **Retenção:** quais prazos e critérios a operação aplica a contas/perfis, mensagens/recibos, relações sociais, sessões revogadas, logs, caches e backups? Expiração de sessão e limite local de 100 chamadas não respondem pela retenção geral.
2. **Exclusão e atendimento:** como os pedidos recebidos no e-mail oficial serão tratados? Confirmar se haverá procedimento manual, validação do solicitante, alcance, prazos e tratamento de backups/cópias de destinatários. O código não fornece um fluxo completo de exclusão; a página não afirma que ele existe. A confirmação do e-mail, por si só, não confirma esses procedimentos.
3. **Infraestrutura efetiva:** quem hospeda o backend, PostgreSQL, backups e logs, em quais países/regiões, e qual operador TURN está ativo, se houver? Há exemplo de implantação AWS no repositório, mas exemplo não comprova produção. Os STUN Google no código já foram identificados; não foram tratados como informação desconhecida.
4. **Compartilhamento operacional:** além de Google, GitHub, participantes e serviços técnicos identificados, quais operadores, prestadores ou administradores têm acesso a dados e para quais finalidades? Contratos e políticas de acesso não podem ser deduzidos do código.
5. **Correspondência com a operação atual:** confirmar que a versão de servidor e as configurações efetivamente usadas correspondem aos fluxos auditados e se existem serviços de telemetria, registros, cópias ou gravações operacionais fora desse código. Nenhuma ausência desses tratamentos foi prometida.

Essas confirmações não foram transformadas em placeholders na página. As lacunas devem ser resolvidas na revisão para que o texto represente a operação efetiva, sem inventar promessas de exclusão, ausência de coleta, anonimato, hospedagem ou retenção.

## Verificação

`npm run build`: 10 testes aprovados, verificação Astro/TypeScript sem erros ou avisos, 2 páginas estáticas geradas. O verificador de produção confere também footer, existência da rota, links internos da política, retorno à Home, título, canonical e inclusão no sitemap.

A conferência visual e de navegação em desktop/mobile é registrada nas capturas desta pasta. O relatório não equivale a publicação ou aprovação da Microsoft. O objetivo é a revisão da página e dos fatos comprovados, com as confirmações acima separadas do conteúdo público.

Resultados adicionais: sem overflow em 360, 390, 768, 1024, 1440 e 1920px (`responsive.json`); índice navega até a seção correta abaixo do header; skip link funcional; página sem ilhas Svelte ou Lenis ativos; console sem erros/warnings observados. A página usa a mesma tipografia e paleta da landing, com corpo legível, índice fixo no desktop e índice em duas colunas no mobile. Capturas: `desktop.jpg` e `mobile.jpg`.

Após o ajuste final de espaçamento das âncoras, a geração estática e o verificador de produção foram executados novamente com sucesso. A cópia integral em Markdown contém as 8 seções da política e nenhum placeholder de contato. As mudanças do website permanecem locais, sem commit ou push.

Atualização do contato oficial: `npm run build` executado novamente com 10 testes aprovados, 0 erros/avisos de Astro/TypeScript e verificação do link `mailto:kelofc1@gmail.com` e do texto visível no HTML gerado. O contato foi retirado da lista de pendências; retenção, atendimento/exclusão, infraestrutura, compartilhamento operacional e correspondência da produção continuam dependendo da confirmação do responsável. Nenhum push, deploy ou alteração no NEXUS Desktop foi realizado nesta atualização.
