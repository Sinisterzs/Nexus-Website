# Política de Privacidade — NEXUS Desktop

Revisão: 10 de novembro de 2026. Versão do aplicativo analisada: 0.2.1 (Stable) e 0.3.0-nightly.1 (Beta).

## Sobre esta política

O **NEXUS Desktop — projeto independente** é um aplicativo de comunicação para Windows. Seu site oficial é [nexus-desktop.pages.dev](https://nexus-desktop.pages.dev/).

Para dúvidas e solicitações relacionadas a dados pessoais, entre em contato pelo canal oficial de privacidade: [kelofc1@gmail.com](mailto:kelofc1@gmail.com).

Esta política descreve os fluxos de dados identificados no código das versões 0.2.1 (Stable) e 0.3.0-nightly.1 (Beta) do aplicativo e de seu servidor. O tratamento depende dos recursos utilizados, como criar uma conta, conversar, fazer chamadas ou compartilhar a tela.

Há dados mantidos no dispositivo e dados transmitidos ao servidor. As informações abaixo distinguem esses locais de armazenamento e os serviços externos envolvidos.

## Conta e autenticação

O cadastro por e-mail envia ao servidor nome de usuário, e-mail, senha e nome de exibição, quando informado. O servidor mantém os dados de conta e perfil no PostgreSQL; para a senha, armazena um hash com Argon2. Dados de perfil também podem incluir avatar, biografia, status e atividade.

Ao escolher o login Google, o aplicativo abre o navegador para a autorização. O fluxo solicita os escopos de identidade, e-mail e perfil (`openid email profile`). O servidor recebe o código de autorização e os dados necessários à sua validação e troca por tokens do Google.

As informações retornadas pelo Google incluem identificador da conta, e-mail e confirmação de e-mail, nome e URL de foto, quando disponíveis. Elas são usadas para identificar ou criar a conta NEXUS e compor o perfil. O login Google não usa um campo de senha Google dentro do aplicativo.

O vínculo Google é registrado no servidor. A desvinculação exige que a conta tenha uma senha definida como alternativa de acesso; desfazer esse vínculo não equivale a excluir a conta NEXUS.

Para manter a sessão, o aplicativo guarda uma credencial de sessão vinculada ao servidor de origem no gerenciador de credenciais do Windows. No servidor, há registros de sessão com hash SHA-256 do token, criação, expiração e revogação, além de tickets temporários de uso único para autenticar conexões em tempo real.

## Mensagens e armazenamento

Ao enviar uma mensagem, o servidor recebe seu texto e os identificadores necessários para associá-la à conversa e ao remetente. O PostgreSQL armazena conversas, conteúdo das mensagens, datas, alterações e confirmações de entrega e leitura. O conteúdo é processado pelo servidor para disponibilizar a conversa aos participantes.

### No seu dispositivo

O SQLite local (`nexus.db`, além de cópia local de segurança gerada em migrações de esquema) mantém conversas, mensagens, estados de leitura, rascunhos, mensagens pendentes de envio e metadados de cache, com separação por conta. Preferências de interface, notificações, privacidade, canal de atualização, qualidade de captura, dispositivos de áudio, volumes individuais por participante e a configuração de rede com a chave pública aprovada do servidor (`nexus_settings.json`, `nexus_network.json` e `localStorage`) também são persistidas localmente.

Relações de amizade, solicitações, bloqueios e informações de presença também são tratados pelo servidor. Nome de usuário, nome de exibição, avatar e informações de presença são usados nos recursos de busca, contatos e comunicação com outras pessoas.

O histórico local de chamadas contém informações como participante, direção da chamada, resultado, duração e data. Nessa versão, a lista guarda até 100 registros por conta no armazenamento local.

## Chamadas e permissões

As chamadas utilizam WebRTC, que normalmente aplica criptografia de transporte padrão (DTLS-SRTP), para transmitir áudio e vídeo de compartilhamento de tela entre os participantes. Na versão analisada, não foi identificado recurso de gravação do conteúdo das chamadas pelo aplicativo ou pelo servidor. O aplicativo enumera os dispositivos de entrada e saída de áudio disponíveis para seleção e alternância automática em caso de desconexão, solicitando o microfone nos fluxos de chamada, identificação de dispositivo ou teste de áudio. O acesso depende das permissões do Windows/WebView e da autorização controlada pelo aplicativo.

O compartilhamento de tela depende de uma ação do usuário e do seletor de captura. A tela ou janela escolhida pode conter dados pessoais, documentos e notificações, que serão visíveis para o outro participante durante a transmissão. O fluxo de captura de tela analisado solicita apenas vídeo (aplicando a resolução e a taxa de quadros selecionadas), sem áudio do sistema.

Ao interromper o compartilhamento, o aplicativo encerra as faixas de captura e revoga a autorização interna de captura. Na implementação nativa analisada, solicitações de permissão da WebView para câmera, geolocalização e notificações são negadas.

O servidor realiza a sinalização das chamadas: transmite convites, estados e informações técnicas para estabelecer ou reconectar a sessão. A mídia pode usar conexão direta entre os participantes ou servidor de retransmissão (TURN), se configurado, conforme as condições de rede.

## Conexões e serviços externos

- **Servidor NEXUS:** recebe requisições de conta, perfil, contatos e mensagens, além da sinalização em tempo real por API HTTPS e WebSocket (no endereço configurado no aplicativo) e armazenamento em PostgreSQL.

- **Google:** participa do login quando essa opção é escolhida. O WebRTC também inclui servidores STUN do Google para identificar caminhos de conexão, inclusive sem login Google. Consulte a [Política de Privacidade do Google](https://policies.google.com/privacy).

- **STUN e TURN:** a negociação de rede usa candidatos ICE, que podem conter endereços IP e informações de conexão. Esses dados são trocados pela sinalização e com o outro participante. O código permite obter um servidor TURN configurado pelo backend, que pode retransmitir a mídia quando necessário.

- **Rede Tailscale:** há integração para identificar a instalação local, o estado de conexão e endereços da rede Tailscale e utilizá-la para acessar um servidor configurado nesse ambiente.

- **GitHub:** o mecanismo de atualização consulta a API de releases, manifestos de versão (canal Estável ou Beta/Nightly) e instaladores assinados hospedados no GitHub. A conexão com esse serviço envolve o endereço IP e os dados técnicos habituais da requisição. Consulte a [declaração de privacidade do GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

- **Imagens de perfil:** perfis podem conter URLs de avatar. Ao carregar uma imagem externa, o aplicativo faz uma requisição ao serviço que hospeda essa imagem.

Os participantes recebem as mensagens, o áudio e a tela compartilhados com eles. O uso desses conteúdos por outra pessoa fica fora dos controles técnicos de armazenamento do aplicativo.

## Registros e segurança

O aplicativo e o servidor não integram SDKs externos de telemetria ou análise de comportamento, mas geram registros técnicos de operação e de falhas. Conforme o evento e o nível de log, esses registros podem conter identificadores de usuário, conexão, sessão e chamada, nome de usuário, e-mail em determinados conflitos de autenticação, endereço IP em bloqueios de limite de requisições e identificação e resolução da fonte de tela capturada.

O servidor usa o endereço IP para limitar tentativas de autenticação; registros operacionais podem conter dados técnicos, e o prazo de guarda não foi confirmado. No WebRTC, métricas técnicas de transporte e mídia (como latência, perda de pacotes, taxa de bits e classificação da rota de rede) são processadas localmente durante a chamada para diagnóstico.

Entre as medidas identificadas no código estão hash de senhas com Argon2id, hash SHA-256 de tokens de sessão no servidor, credencial de sessão vinculada ao servidor no gerenciador do Windows, verificação da chave pública do servidor (Ed25519), validação criptográfica de atualizações (Minisign), validação do login Google e verificações de autenticação e participação nas conversas. Essas medidas não representam garantia de ausência de incidentes, de criptografia ponta a ponta para mensagens armazenadas no servidor ou de anonimato.

## Controles e exclusão de dados

O aplicativo permite editar informações do perfil, sair da sessão, desvincular o Google quando existe uma senha alternativa e limpar o histórico local de chamadas. Cada ação tem um alcance específico.

**Sair da conta não apaga o histórico local nem a conta no servidor.** O logout remove a credencial local e tenta revogar a sessão no backend; essa tentativa pode depender da disponibilidade da rede.

O recurso de apagar uma mensagem no servidor substitui o conteúdo por uma indicação de mensagem apagada e registra a data da exclusão. O registro e seus metadados podem permanecer. Essa ação não comprova a remoção de cópias em backups ou de conteúdos já recebidos por outra pessoa.

A expiração de uma sessão ou de uma credencial de conexão não equivale à exclusão dos dados de conta e das conversas. Não foi identificado, na versão analisada, um fluxo completo de exclusão da conta pelo usuário nem um procedimento de remoção de todas as cópias e backups.

## Atualizações desta política

As práticas descritas correspondem à versão do código indicada no início desta página. Mudanças nos recursos, no servidor ou nos serviços utilizados podem exigir uma nova revisão do texto.

O código que fundamentou esta revisão está disponível no [repositório do NEXUS Desktop](https://github.com/Sinisterzs/NEXUS/tree/c7e891807777307551b4134faea895e5a085760c).
