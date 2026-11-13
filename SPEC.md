# SPEC — Portfólio do Esaú (Tema: STAR WARS / HoloNet Tactical Terminal)

> Especificação completa e unificada para construir o portfólio **do zero**, fugindo de qualquer estética genérica de IA. Salve este arquivo na raiz do projeto como `SPEC.md` e siga na ordem. No fim há um **prompt inicial** pronto para colar no agente.

---

## 0. Como usar este arquivo e Regras Anti-IA (Anti-Slop)

1. **Ative a skill de UI/UX antes de qualquer linha de código:** utilize obrigatoriamente o repositório `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill` para guiar todas as decisões de hierarquia visual, espaçamento, contraste, microinterações e arquitetura de componentes.
2. **Proibições Visuais ("Cara de IA"):**
   - **PROIBIDO** usar gradientes roxo/azul/ciano neon genéricos (`from-purple-500 to-cyan-500`) ou o roxo-padrão da Twitch como cor dominante.
   - **PROIBIDO** usar cards com `border-radius: 24px` e `backdrop-filter: blur()` genérico espalhado por toda a tela sem propósito estrutural.
   - **PROIBIDO** usar textos com cara de LLM ("Transformando ideias em realidade digital", "Apaixonado por criar soluções inovadoras", "Bem-vindo ao meu universo"). O texto deve ser **direto, técnico, sóbrio e com personalidade de engenharia**.
3. **Leia tudo antes de escrever código** e abra as **três referências** (seção 2) no navegador, inspecionando com o DevTools. O nível de acabamento delas é o mínimo aceitável.
4. Tudo que estiver como `[PREENCHER]` ou `[CONFIRMAR]` depende do Esaú. **Nunca invente números, clientes, métricas ou depoimentos.** Se faltar dado, deixe um placeholder técnico visível (`[DADO RESTRITO // AGUARDANDO DESCLASSIFICAÇÃO]`) e liste em `PENDENCIAS.md`.
5. Trabalhe por fases (seção 19). Ao fim de cada fase, rode a checagem de aceite (seção 20).

---

## 1. Objetivo

Um portfólio pessoal que:

- Passa em poucos segundos a ideia de **"Engenheiro Full Stack & Criador de Ferramentas de Transmissão"** operando um terminal tático da Orla Exterior (Star Wars), com **identidade visual única** (zero cara de template).
- Funciona como **vitrine técnica de alto nível para vagas e clientes freelance** e como **cartão de visita da estação de transmissão** `taldosatis` (Twitch).
- Combina **Cult UI (`ExpandableScreen`)**, **Remotion (`@remotion/player`)** e **React Bits** sob a direção da **`ui-ux-pro-max-skill`** para entregar um gancho interativo cinematográfico, mantendo uma **versão direta e rápida (`/direto`)** para recrutadores com pressa.
- Conta projetos como **arquivos de missão / estudos de caso** (Problema → Arquitetura/Ação → Resultado real + Blueprint animado no Remotion), e não como mera lista de logos de tecnologias.

**Quem é o Esaú (base para o conteúdo):** desenvolvedor Full Stack na plataforma de gestão de frotas Manfrota (NestJS, GraphQL, microsserviços, integração de IA com Google Gemini), desenvolvedor web freelance e streamer na Twitch (canal `taldosatis`). Forte em frontend (Next.js, animações complexas, design systems), backend Node.js e automação/hardware (Arduino + Python + ffmpeg).

---

## 2. Referências de nível (obrigatório abrir)

| # | Link | O que observar |
|---|------|----------------|
| 1 | https://portfolio-un.vercel.app | Portfólio gamificado (controles de teclado, mapa, diário, conquistas). Tem um botão **"Portfólio direto"** (`/direto/index.html`) com a versão tradicional para quem não quer interagir com o palco. Alternância PT/EN. Tela de carregamento temática. |
| 2 | https://portfolio-lia-lourenco.vercel.app | **Ambiente interativo** com elementos clicáveis, **som ambiente sintetizado no navegador**, link "pular para o conteúdo", currículo em PDF, `og:image` própria, `theme-color`, trajetória e projetos com processo de engenharia explicado. |
| 3 | https://ofelipemart.gevia.co | **Tema coeso do início ao fim.** Projetos como **estudos de caso** com resultado em números e detalhe expansível. Seção de **commits do GitHub** (um "pino" por dia). Métricas reais e contato estruturado como escolha de portas. |

**Como usar as referências:** abra no desktop e no celular, ative o throttling de rede no DevTools, rode o Lighthouse, inspecione a árvore de DOM, as animações (Performance/Animations), as fontes e as imagens. Replique o **nível de capricho, coesão e performance**, não o visual. Não copie código, textos nem assets.

**O que as três têm em comum (vira requisito):**

1. Um conceito único e coeso, aplicado em *tudo* (carregamento, navegação, cursor, microcopy, sons, 404).
2. Interatividade que recompensa a curiosidade, mas sem esconder o conteúdo.
3. Conteúdo real, específico e com prova (links, resultados, números verdadeiros).
4. Cuidado rigoroso com metadados, compartilhamento e acessibilidade.

---

## 3. Conceito: "HOLONET TACTICAL TERMINAL" (Star Wars Analógico + Live)

O portfólio é um **Terminal Tático de Comando e Transmissão da Orla Exterior**, inspirado na estética **Star Wars Analógico / Cassete Futurista** (painéis da Aliança Rebelde em *Yavin 4*, interfaces da série *Andor*, *Rogue One* e cockpit da *Millennium Falcon*), fundido com a operação real de live do Esaú (`taldosatis`).

Elementos de linguagem e interface (usar em todo o site):

- **Geometria Analógica Industrial:** painéis com cantos chanfrados em 45° (`clip-path`), grades aparentes de `1px solid`, miras táticas nos cantos (`+`), códigos de telemetria monoespaçados e micro-rótulos decorativos em **Aurebesh** (sempre com `aria-hidden="true"` para não afetar leitores de tela nem a leitura principal).
- **HUD de Comando e Transmissão:** indicador `● TRANSMITTING // FREQ: TALDOSATIS` (ou `STANDBY`), cronômetro de missão (uptime da sessão), coordenadas do setor e nome/número do setor atual.
- **Deck de Setores (Navegação estilo Painel de Nave / Stream Deck):** botões táticos físicos/industriais para alternar entre os 6 setores, com atalhos de teclado `1`–`6` e efeito de faísca laser ao clique (`ClickSpark` do React Bits).
- **Transição entre Setores (Star Wars Wipe / Hyperspace Stinger):** corte clássico horizontal/diagonal estilo George Lucas ou interferência de transmissão HoloNet (com suporte ao vídeo WebM VP9 com alfa feito pelo Esaú em Python + ffmpeg e fallback nativo em CSS/Canvas).
- **Holo-Comms (Chat Simulado de Interceptação):** painel lateral exibindo transmissões interceptadas no setor atual. **Deve estar explicitamente rotulado como `[SIMULATED HOLONET COMMS]`** (não fingir ser espectadores reais). Aceita **comandos de terminal** (`!projetos`, `!stack`, `!sobre`, `!contato`, `!holocron`, `!direto`, `!ajuda`, `!ordem66`) que funcionam como navegação alternativa.
- **Alertas de Telemetria (Toasts Táticos):** notificações estilo visor de capacete/cockpit ao abrir um arquivo de missão, copiar o e-mail, gravar um Holocron ou desbloquear um easter egg.
- **Botão "GRAVAR HOLOCRON" (referência ao botão físico de clip em Arduino que o Esaú construiu):** cria um **link direto para o setor atual**, copia para a área de transferência, dispara um efeito de varredura holográfica e registra a conquista. Funcionalidade real e útil.
- **Sequência de Ignição (Cena 0):** tela inicial de boot do Navi-Computador com checagem de sistemas e botão **ACIONAR HIPERESPAÇO (ENTRAR)**.
- **Encerramento de Transmissão (Contato):** "Estabelecer Frequência de Comunicação / Enviar Transmissão Rebelde" como CTA de contato.

**Regras de honestidade do conceito:**

- Não exibir contagem falsa de espectadores nem seguidores. Use **uptime da sessão**, coordenadas do setor e, quando a integração estiver ativa (seção 6.7), **status real** do canal na Twitch.
- O terminal Holo-Comms é decorativo/interativo e claramente sinalizado como simulação.

---

## 4. Bibliotecas e Skills Obrigatórias + Escopo

### 4.1 Mapeamento Obrigatório de Ferramentas

1. **Skill `ui-ux-pro-max-skill` (`https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`):**
   - Deve ser lida e aplicada antes de iniciar o código. Define o rigor de espaçamento, tipografia, contraste, estados de foco/hover, prevenção de layout shift e eliminação de clichês visuais de IA.
2. **Cult UI — `ExpandableScreen` (`https://www.cult-ui.com/docs/components/expandable-screen`):**
   - Usado obrigatoriamente na **Cena 3 (Arquivos de Missão / Projetos)** e na **Cena 5 (Astromech Lab)**.
   - Cada projeto é exibido como um **Cartão de Dados Tático (Holocron)**. Ao clicar, o `ExpandableScreen` expande suavemente o cartão em uma **tela cheia de briefing tático** (mantendo o contexto espacial, suporte a tecla `Esc` e `focus trap`), onde o recrutador lê o estudo de caso completo e assiste ao blueprint animado no Remotion.
3. **Remotion (`https://github.com/remotion-dev/remotion` — `remotion` + `@remotion/player`):**
   - Usado para renderizar **vídeos e diagramas técnicos programáticos em React a 60fps** (sem depender de MP4 pesados e estáticos):
     - **Composição 1 (`HyperspaceBoot`):** animação curta de salto no hiperespaço / alinhamento de mira tática na entrada do cockpit.
     - **Composição 2 (`ManfrotaGeminiPipeline`):** diagrama animado dentro do `ExpandableScreen` do projeto Manfrota mostrando o fluxo real: *Cron Job → NestJS → Cache Redis → Google Gemini (JSON Mode + Search Grounding) → Alerta de Pneus/Manutenção*.
     - **Composição 3 (`ArduinoClipPipeline`):** diagrama animado dentro do projeto Stream Lab mostrando: *Clique Físico no Arduino → Porta Serial → Script Python → Twitch Helix API → Download `yt-dlp` → Render Vertical 9:16 no `ffmpeg`*.
4. **React Bits (`https://reactbits.dev`):**
   - Extrair e customizar para a estética Star Wars:
     - `DecryptedText` / `ScrambleText`: títulos de setores e coordenadas que decodificam de caracteres técnicos/Aurebesh para português na entrada da cena.
     - `Starfield` / `GridMotion`: fundo espacial sutil no cockpit com paralaxe controlada.
     - `ClickSpark`: faíscas táticas âmbar/azul ao clicar nos botões do Deck de Setores e no botão Gravar Holocron.
     - `SpotlightCard`: iluminação direcional estilo feixe holográfico nos cards de projetos e módulos de stack.

### 4.2 Escopo do Projeto

#### Obrigatório (v1)
- Tela de carregamento / Sequência de Ignição do Navi-Computador com entrada interativa.
- 6 setores (cenas) navegáveis com transição de wipe tático / stinger (seção 5).
- HUD do cockpit, deck de setores, atalhos de teclado (`1`–`6`), sincronia com `#hash` da URL.
- Terminal Holo-Comms (chat simulado) com comandos.
- Alertas táticos de transmissão.
- Botão **GRAVAR HOLOCRON** (CLIPAR) com link direto do setor.
- Estudos de caso de pelo menos 4 projetos usando **Cult UI `ExpandableScreen`** + blueprints animados em **Remotion**.
- Microinterações com **React Bits** (`DecryptedText`, `Starfield`, `ClickSpark`, `SpotlightCard`).
- Versão **`/direto`** (*Rebel Data Pad*: HTML simples, rápida, acessível, imprimível).
- SEO, Open Graph dinâmico, acessibilidade WCAG 2.2 AA, `prefers-reduced-motion`.
- PT-BR completo. Deploy na Vercel.

#### Desejável (v1.1)
- Status real da Twitch (`taldosatis` ao vivo agora + player embutido no monitor do cockpit quando estiver no ar).
- Radar Galáctico de Commits do GitHub (dados reais).
- Inglês (EN).
- Sons sintetizados com Web Audio API (bipes de droide astromecânico, cliques mecânicos de cockpit, hum de reator — desligados por padrão).
- Easter eggs temáticos de Star Wars + Live.

#### Stretch (v2)
- Setor "Arsenal" com objeto 3D interativo (Sabre/Botão Arduino/Holocron em Three.js / React Three Fiber).
- Diário de bordo / blog técnico "Bastidores da Orla Exterior".
- Demos interativas ao vivo dos overlays de chat e sound alerts.

#### Fora de escopo
- CMS, login, banco de dados próprio, painel admin.
- Números falsos, depoimentos inventados, contadores fictícios de audiência.

---

## 5. Setores (Cenas) e Conteúdo

> Textos abaixo são **rascunhos técnicos e diretos** em PT-BR (sem clichês de IA) para o agente partir de algo sólido. O Esaú deve revisar. Marque `[CONFIRMAR]` ou `[PREENCHER]` onde houver dúvida.

### Setor 0 — Sequência de Ignição (Boot Screen / Entrada)

- Fundo escuro espacial (`Starfield` sutil do React Bits + grade técnica chanfrada), título forte **ESAÚ SANTANA**, subtítulo `ENGENHEIRO FULL STACK · IA · STREAMER [SECTOR: TALDOSATIS]`.
- Barra de "Inicializando Sistemas do Cockpit" com logs rápidos em fonte monoespaçada:
  - `> CALIBRATING NAVI-COMPUTER... OK`
  - `> LOADING ASTROMECH IA MODULES (NESTJS / GEMINI)... OK`
  - `> SYNCING HOLONET STREAM DECK... OK`
- Botão principal chanfrado em âmbar: **ACIONAR HIPERESPAÇO / ENTRAR NO TERMINAL** (foco automático, `Enter` ativa).
- Link secundário de alto contraste: **Acessar Data Pad Direto (`/direto`)**.
- Ao entrar: transição curta (`HyperspaceBoot` via Remotion ou Stinger) → Setor 1. Se `prefers-reduced-motion` estiver ativo, corte seco imediato sem animação pesada.

### Setor 1 — Comando Central (`#intro`)

- Headline (com efeito `DecryptedText` do React Bits): *"Eu construo sistemas críticos com IA em produção e o hardware/software da minha própria transmissão ao vivo."*
- Linha de apoio: *"Desenvolvedor Full Stack (Node.js/NestJS & React/Next.js), arquiteto de integrações com LLMs e criador do laboratório de lives taldosatis."*
- CTAs táticos (com `ClickSpark`): **Inspecionar Arquivos de Missão (Projetos)** (vai para o setor 3) e **Abrir Frequência de Contato** (setor 6).
- Elemento visual principal: **Módulo Holo-Projetor** com moldura tática chanfrada + foto/avatar do Esaú `[PREENCHER]`, com leve varredura de scanline holográfico, paralaxe suave no mouse e telemetria lateral em tempo real (status da estação, localização: Santa Fé do Sul/SP, stack ativa).

### Setor 2 — Registro do Piloto (`#sobre`)

- Texto curto e direto em primeira pessoa (máx. 3 parágrafos) `[PREENCHER]`: formação em Análise e Desenvolvimento de Sistemas (UNIFUNEC), atuação prática resolvendo gargalos reais em arquitetura de microsserviços e interfaces ricas, e como o hábito de fazer live na Twitch impulsionou a criação de ferramentas próprias de hardware e vídeo. Indicar foco atual (vagas Full Stack/Backend/Frontend e projetos freelance).
- **Cronologia da Frota (Linha do Tempo):** marcos reais da carreira e formação `[PREENCHER]`.
- **Protocolo de Engenharia (Como eu trabalho em 5 etapas):**
  1. `01 // RECONHECIMENTO`: Entendimento profundo do gargalo de negócio e restrições de custo/latência.
  2. `02 // BLUEPRINT`: Desenho de contratos (GraphQL/REST), modelagem de dados e definição de UI/UX.
  3. `03 // CONSTRUÇÃO`: Código limpo e tipado (TypeScript estrito), microsserviços resilientes e animações a 60fps.
  4. `04 // TESTE DE CARGA`: Validação de casos extremos, idempotência, acessibilidade e fallback.
  5. `05 // OPERAÇÃO`: Deploy automatizado, cache inteligente, monitoramento de custos de IA e iteração.
- Disponibilidade e modalidade: `[CONFIRMAR]` (CLT/PJ, freelance, remoto, Santa Fé do Sul - SP).

### Setor 3 — Arquivos de Missão / Projetos (`#projetos`)

Cards táticos (`SpotlightCard` do React Bits com cantos chanfrados). Ao clicar em qualquer card, o componente **`ExpandableScreen` (Cult UI)** expande o card em tela cheia para exibir o **Dossiê Completo da Missão**, contendo o problema, a arquitetura detalhada, um **Player Remotion interativo** explicando o fluxo técnico em vídeo programático e os resultados reais:

Estrutura de cada dossiê:
`Código da Missão · Título · Papel · Período · Contexto/Problema · Arquitetura & Ação · Blueprint Animado (Remotion) · Resultado (números reais) · Stack · Links`

Projetos candidatos (todos `[CONFIRMAR]` quanto ao que pode ser público):

1. **`MISSION_01` // Manfrota — Inteligência Artificial Aplicada à Gestão de Frotas**
   - **Contexto:** plataforma corporativa de gestão de frotas e equipamentos operando em arquitetura de microsserviços.
   - **O que eu fiz:** integração do Google Gemini nos módulos de pneus, manutenção e combustível. Implementação de serviços com cron jobs idempotentes, camada de cache em Redis, respostas estritas em JSON mode, pesquisa de preços em tempo real utilizando Google Search Grounding e sistema de alertas preditivos para descarte de pneus. Desenvolvimento de chat de IA para consulta do sistema em linguagem natural via Tool Calling e RAG.
   - **Blueprint no Remotion (`ManfrotaGeminiPipeline`):** animação programática demonstrando a requisição passando pelo Redis, acionando o Gemini com Grounding, validando o schema JSON e otimizando o consumo de tokens.
   - **Resultado:** redução expressiva de custo por execução diária ao migrar e calibrar o modelo com limite estrito de tokens → **`[PREENCHER número/percentual real]`**.
   - **Stack:** NestJS · GraphQL · Node.js · TypeScript · Redis · PostgreSQL · Google Gemini API.
   - ⚠️ *Nota:* Confirmar com a empresa o que pode ser divulgado publicamente. Se necessário, manter métricas em percentual e omitir dados sensíveis de clientes.

2. **`MISSION_02` // Astromech Stream Lab — Hardware & Ferramentas da Live `taldosatis`**
   - **Contexto:** necessidade de ferramentas de transmissão de baixo consumo de recursos e automação de cortes verticais durante as lives na Twitch sem interromper a operação.
   - **O que eu fiz:**
     - **Botão físico de Clip (Hardware + Software):** protótipo em **Arduino** que, ao ser pressionado fisicamente na mesa, comunica via serial com um script Python integrado à **API Helix da Twitch**, baixa o clipe via `yt-dlp` e renderiza automaticamente o vídeo editado na proporção vertical 9:16 usando `ffmpeg`.
     - **Stinger Procedural:** transição de vídeo em WebM VP9 com canal alfa gerada programaticamente com Python (Pillow/NumPy) + `ffmpeg`.
     - **Overlays Customizados:** chat para StreamElements com estética *frosted glass* e widget de alertas sonoros customizado.
   - **Blueprint no Remotion (`ArduinoClipPipeline`):** animação passo a passo desde o pulso elétrico no botão Arduino até a renderização final 9:16 em `ffmpeg`.
   - **Stack:** Python · C++ (Arduino) · FFmpeg · Twitch Helix API · HTML/CSS/JS.

3. **`MISSION_03` // LoveOn — Plataforma de Presentes Digitais com 3D e Realidade Aumentada**
   - **Contexto:** plataforma SaaS para criação de páginas personalizadas de presentes digitais contendo mapas estelares, fases da lua, modelos 3D interativos, Realidade Aumentada (AR), música e QR Code exclusivo.
   - **O que eu fiz:** desenvolvimento do backend utilizando Prisma e Supabase e reconstrução completa da experiência frontend em Next.js, Tailwind CSS e Framer Motion, incluindo um wizard de criação fluido e renderização otimizada para dispositivos móveis.
   - **Stack:** Next.js · React · TypeScript · Tailwind CSS · Framer Motion · Prisma · Supabase · 3D/AR.
   - **Link:** `https://ove-on-tau.vercel.app` `[CONFIRMAR URL final]`.

4. **`MISSION_04` // Create Plate & Landing Pages Comerciais de Alta Performance (Freelance)**
   - **Contexto:** desenvolvimento do sistema **Create Plate** (placas físicas em acrílico com chip NFC e QR Code integradas a páginas rápidas para captação de avaliações no Google) e landing pages com design system próprio para o setor gastronômico (ex.: DAMA Pizzaria, Eduarda Cozinha e Vinhos).
   - ⚠️ `[CONFIRMAR]` quais páginas gastronômicas foram entregues/publicadas como clientes reais e quais devem ser apresentadas como "Proposta Técnica / Estudo de Caso".
   - **Stack:** Next.js · React · Tailwind CSS · HTML/CSS · Design Systems.

Regra: **mínimo 3 projetos com link real** (site no ar, repositório ou vídeo demonstrativo). Sem link público, o card exibe o selo `[ACESSO RESTRITO // PROJETO INTERNO]`.

### Setor 4 — Arsenal & Sistemas (`#stack`)

- "Arsenal" é a seção de especificações técnicas da nave e do equipamento de transmissão. Dividir em módulos táticos (Núcleo Backend, Interface & Motion, Unidade Astromecânica de IA, Mídia/Transmissão, Hardware & Infra), cada item com tag técnica:
  - **Núcleo de Hiperpropulsão (Backend):** NestJS, Node.js, TypeScript, GraphQL, PostgreSQL, Prisma, TypeORM, MongoDB, Redis, Docker, Microsserviços.
  - **Sistemas de Visor & Motion (Frontend):** Next.js, React, Tailwind CSS, Framer Motion, **Remotion**, **Cult UI**, **React Bits**, Three.js, Leaflet, Globe.gl.
  - **Unidade Astromecânica (IA):** Google Gemini API (JSON mode, Search Grounding, Embeddings), RAG, Tool Calling, engenharia de contexto e controle de custos de tokens.
  - **Engenharia de Mídia & Live:** FFmpeg, Python (Pillow, NumPy, automação), OBS Studio, StreamElements, Twitch Helix API.
  - **Hardware & Operações:** Arduino (integração serial), servidores Linux locais, SSH, Tailscale.
- Cada módulo inclui **uma frase técnica explicando como a ferramenta foi usada em produção** (ex.: *"Redis: controle de idempotência e cache de respostas estruturadas do Gemini para reduzir latência e custo diário"*), nunca apenas uma lista de ícones ou barras de porcentagem.

### Setor 5 — Laboratório da Orla Exterior / Demos (`#lab`)

- Área de **provas de engenharia ao vivo** e telemetria real:
  - **Console Interativo Remotion:** um player `@remotion/player` com controles expostos para o visitante dar play, pausar e inspecionar frame a frame uma animação de arquitetura/stinger feita em código React pelo Esaú.
  - **Radar Galáctico de Commits (GitHub):** gráfico de contribuições reais (seção 6.8) estilizado como setores estelares iluminados no painel tático.
  - **Monitor de Transmissão da Base (`taldosatis`):** preview interativo dos overlays/widgets e vídeo curto do botão físico de clip em Arduino em ação `[PREENCHER]`. Se o canal estiver ao vivo na Twitch, exibe o embed oficial no monitor do cockpit (seção 6.7).
- Botão usando `ExpandableScreen` (Cult UI) para abrir o detalhamento técnico ("Como construí este laboratório").

### Setor 6 — Frequência de Contato / Fim de Transmissão (`#contato`)

- Título: **"Estabelecer Frequência de Comunicação"** (ou **"Enviar Transmissão para a Base"**).
- Opções de contato apresentadas como **Portas de Comunicação / Canais de Hiperfrequência**:
  - E-mail (com botão **COPIAR FREQUÊNCIA** + faísca `ClickSpark` + alerta de confirmação)
  - WhatsApp
  - LinkedIn
  - GitHub
  - Twitch (`taldosatis`)
  - Download do Data Pad Oficial (Currículo em PDF) `[PREENCHER todos os links]`
- Status operacional: aviso claro de disponibilidade para vagas/freelance e tempo médio de resposta `[CONFIRMAR]`.
- Rodapé técnico: `© ANO ESAÚ SANTANA // SECTOR: OUTER RIM`, link direto para `/direto` e atalho para o canal.

### Páginas extras

- `/direto`: versão tradicional estilizada como *Rebel/Imperial Data Pad* (seção 11).
- `404` temática: *"ARQUIVOS INCOMPLETOS — Se um item não consta em nossos registros, então ele não existe (Erro 404)"*, com botão imediato para retornar ao Cockpit.

---

## 6. Interações e Sistemas

### 6.1 Motor do Cockpit (Stage)

- Estado global (`store/stage.ts` em Zustand): `currentScene`, `isTransitioning`, `soundEnabled`, `reducedMotion`, `chatOpen`, `locale`.
- Navegação: clique no Deck de Setores, teclado (`1`–`6`, setas direcionais, `Esc` fecha qualquer `ExpandableScreen` aberto), comandos do terminal Holo-Comms, swipe horizontal no mobile.
- **URL:** sincronizar com `location.hash` usando **somente nomes simples** (`#intro`, `#sobre`, `#projetos`, `#stack`, `#lab`, `#contato`). Ao carregar a página já com hash, abrir diretamente no setor correspondente (sem bloquear com a tela de boot se vier de um link compartilhado).
- **Foco e leitor de tela:** ao trocar de setor, mover o foco programaticamente para o `<h1>/<h2>` do setor e anunciar `"Setor X de 6: Nome"` em uma região `aria-live="polite"` oculta visualmente.

### 6.2 Transição de Setor (Star Wars Wipe & Stinger)

- Suporte duplo:
  1. Vídeo **WebM VP9 com canal alfa** (gerado pelo Esaú com Python + ffmpeg) sobreposto em tela cheia no momento do corte.
  2. **Star Wars Tactical Wipe / Fallback obrigatório** (já que o Safari não reproduz VP9 com alfa em todas as versões): wipe diagonal/horizontal clássico de Star Wars com linha de feixe de laser âmbar/azul em CSS/Canvas ou composição leve do Remotion com exatamente o mesmo timing.
- Carregar o vídeo em *idle* e só reproduzir quando estiver pronto. Duração total ≤ 900 ms; o conteúdo do setor troca no ponto de cobertura máxima ( ~450 ms).
- Com `prefers-reduced-motion: reduce`: troca por corte seco ou fade curto (≤ 150 ms), sem deslocamento espacial.

### 6.3 Terminal Holo-Comms (Chat Simulado)

- Banco de mensagens por setor (arquivo `src/content/chat.ts`), com identificadores de unidades/pilotos fictícios claramente marcados como simulação (`[DROID_LOG]`, `[REBEL_BASE]`, `[ASTROMECH_04]`).
- Mensagens entram em ritmo variável e reagem às ações do visitante (trocar de setor, expandir um estudo de caso no `ExpandableScreen`, gravar um Holocron).
- Campo de entrada aceitando **comandos de terminal** (`!projetos`, `!stack`, `!sobre`, `!contato`, `!clip` / `!holocron`, `!direto`, `!ajuda`). Comandos desconhecidos respondem com a lista de protocolos disponíveis (`!ajuda`).
- Mensagens digitadas pelo visitante aparecem apenas localmente na sessão (nada é enviado a servidores externos).
- Acessibilidade: `role="log"`, `aria-live="off"` (para não interromper leitores de tela continuamente), botão visível para **pausar/ocultar** o terminal. Limite máximo de ~80 mensagens no DOM.
- Mobile: o terminal vira uma **gaveta tática (drawer)** fechada por padrão.

### 6.4 Alertas Táticos (Toasts)

- Fila de 1 alerta por vez, duração de 3–4 s, posicionado no canto superior direito do visor, com moldura chanfrada, nunca cobrindo o título ou CTA principal.
- Eventos disparadores: expandir um projeto no `ExpandableScreen`, copiar o e-mail, acionar o botão Gravar Holocron, desbloquear um easter egg, completar a exploração de todos os 6 setores (conquista `"Explorador da Orla Exterior"`).
- Respeitar `prefers-reduced-motion` e o estado de som desligado.

### 6.5 Botão GRAVAR HOLOCRON (CLIPAR)

- Fixo no Deck do Cockpit (com `ClickSpark` do React Bits).
- Ao clicar: flash curto de varredura holográfica azul, alerta `"Holocron gravado // Coordenadas copiadas"`, copia `https://<dominio>/#<setor>` para a área de transferência (com fallback seguro caso a Clipboard API falhe) e registra a conquista `"Primeiro Holocron"`.
- Atalho de teclado: tecla `C`.

### 6.6 Sons Sintetizados de Cockpit e Droide (Opcional, desligado por padrão)

- Sintetizados inteiramente via **Web Audio API** (zero arquivos MP3/WAV pesados):
  - Bip curto de droide astromecânico (duas frequências senoidais rápidas) ao gravar Holocron ou receber alerta.
  - Clique mecânico seco ao acionar botões do Deck de Setores.
  - Hum grave e sutil na transição de setor.
- Toggle visível no HUD (`AUDIO: ON/OFF`), estado salvo em `localStorage` protegido por `try/catch`. **Nunca** emitir som antes da primeira interação explícita de ativação pelo usuário.

### 6.7 Status Real da Transmissão na Twitch (v1.1)

- Rota `GET /api/twitch/status` no servidor Next.js: obtém **App Access Token** (`client_credentials` em `https://id.twitch.tv/oauth2/token`) e consulta `https://api.twitch.tv/helix/streams?user_login=taldosatis`.
- Cache da resposta no servidor (ex.: `revalidate: 60`) para proteger limites de requisição.
- UI: selo `● TRANSMITTING LIVE` piscando em vermelho imperial no HUD + botão `"Sintonizar Transmissão"`; quando estiver ao vivo, habilitar o **embed oficial** (`player.twitch.tv`, com `parent=<dominio>`) no Setor 5. Quando offline, exibir `"STATION OFFLINE // ÚLTIMA TRANSMISSÃO REGISTRADA"` e link para o canal.
- Chaves secretas apenas em variáveis de ambiente do servidor.

### 6.8 Radar Galáctico de Commits do GitHub (v1.1)

- Rota de servidor consulta a **GraphQL API do GitHub** (`contributionsCollection.contributionCalendar`) usando token somente leitura, com cache ISR (revalidar a cada 6–12 horas).
- Visual: grade técnica de "Sistemas Estelares / LEDs de Telemetria" (um por dia do ano), intensidade em tons de Azul HoloNet ou Âmbar Rebelde conforme a contagem; tooltip monoespaçado com data e quantidade de commits; resumo superior (total anual, maior sequência de operação, pico diário).
- Fallback: se a API falhar ou o token não estiver configurado, ocultar o módulo de forma limpa sem quebrar a página.
- Usuário do GitHub: `[PREENCHER]`.

### 6.9 Easter Eggs Temáticos (Poucos e Bem Executados)

- **Konami Code** → ativa o `"MODO SITH / IMPERIAL OVERRIDE"` (altera os acentos de Âmbar/Azul para Vermelho Sabre de Luz e Cinza Imperial por 15 segundos, com opção de manter).
- Digitar `!ordem66` ou `!raid` no terminal Holo-Comms → efeito especial de transmissão interceptada no HUD.
- Clicar 5× no indicador `● TRANSMITTING / STANDBY` → exibe log secreto dos bastidores da construção do portfólio.
- Todos os efeitos respeitam estritamente `prefers-reduced-motion`.

---

## 7. Design System: "Rebel Tactical UI" (Guiado por `ui-ux-pro-max-skill`)

### Direção Visual

Estética de **Terminal Tático Analógico de Star Wars (*Andor* / *Rogue One* / Cassete Futurista)** combinada com a precisão de **overlays profissionais de transmissão**: superfícies em metal escuro espacial, painéis com cantos cortados em 45° (`clip-path`), bordas técnicas de `1px`, miras de calibração nos cantos, tipografia industrial afiada e ausência total de gradientes neon genéricos de IA.

### Tokens (CSS Variables em `:root`)

```css
:root {
  /* Superfícies de Cockpit e Metal Espacial */
  --bg:          #07080A; /* Vácuo espacial profundo */
  --surface:     #0E1116; /* Painel metálico principal */
  --surface-2:   #151A22; /* Módulo elevado / ativo */
  --line:        #222936; /* Grade estrutural 1px */
  --line-bright: #38455A; /* Borda de foco / mira ativa */

  /* Texto (Alto contraste sem usar #FFFFFF puro) */
  --text:        #F0EEE9; /* Branco osso quente (leitura confortável) */
  --muted:       #94A0B8; /* Cinza técnico de telemetria (contraste >= 4.5:1 sobre --bg e --surface) */
  --dim:         #5B667A; /* Apenas para elementos decorativos / Aurebesh */

  /* Acentos Star Wars Analógico */
  --accent:      #FF9F1C; /* Âmbar Rebelde (CTAs principais, miras, foco ativo) */
  --hologram:    #38BDF8; /* Azul HoloNet (links, projeções, blueprints Remotion) */
  --live:        #EF233C; /* Vermelho Imperial / Sabre (● TRANSMITTING, alertas críticos) */
  --accent-2:    #2EC4B6; /* Verde Telemetria (status online, sistemas operacionais) */

  /* Efeitos e Vidro Tático */
  --glass:       rgba(14, 17, 22, 0.78);
  --glow-amber:  0 0 20px rgba(255, 159, 28, 0.25);
  --glow-holo:   0 0 20px rgba(56, 189, 248, 0.25);
  --glow-live:   0 0 24px rgba(239, 35, 60, 0.35);

  /* Geometria Chanfrada (Substitui border-radius arredondado genérico) */
  --chamfer-sm:  polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  --chamfer-md:  polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  --r-sm:        2px;
  --r-md:        4px;

  /* Curvas de Animação Mecânicas */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

- Todos os pares de texto legível/fundo devem manter contraste **≥ 4.5:1** (validado via axe-core).
- Definir `color-scheme: dark` e `<meta name="theme-color" content="#07080A">`.

### Tipografia

- **Display (Títulos de Setor e Cabeçalhos):** `Chakra Petch` ou `Space Grotesk` (geométrica, angular, tecnológica e com forte presença industrial).
- **Mono (HUD, Telemetria, Holo-Comms, Labels, Botões):** `JetBrains Mono` (com `font-variant-numeric: tabular-nums` para contadores e coordenadas não tremerem).
- **Corpo (Textos longos e Estudos de Caso no `ExpandableScreen`):** `Plus Jakarta Sans` ou `DM Sans` (máxima legibilidade em parágrafos).
- **Decorativa (Selo Secundário):** fonte **Aurebesh** auto-hospedada em `.woff2`, aplicada **exclusivamente** em micro-selos decorativos de borda com `aria-hidden="true"`.
- Carregar todas via `next/font` (`display: swap`), com fallbacks seguros. Escala fluida com `clamp()`.

### Componentes Base (Combinando UI Própria + Cult UI + React Bits)

- **Estrutura & Cockpit:** `HudBar`, `SceneDeck`, `DeckButton`, `ChatDock` (Holo-Comms), `ChatMessage`, `AlertToast`, `ClipButton` (Gravar Holocron), `LiveBadge`, `StingerOverlay`, `ChamferPanel`, `Tag`, `TacticalButton`, `SkipLink`.
- **Cult UI:** `ExpandableScreen` (adaptado com bordas chanfradas, cabeçalho de telemetria e suporte a fechamento via `Esc`).
- **React Bits:** `DecryptedText`, `Starfield`, `ClickSpark`, `SpotlightCard`.
- **Remotion Players:** `RemotionBlueprintPlayer` (wrapper com lazy load e controles táticos customizados).

Todos os componentes interativos devem possuir estados claros de `hover`, `focus-visible` (contorno âmbar `--accent` de `2px`), `active` e `disabled`, além de área mínima de toque de `44x44px`.

---

## 8. Animação, Motion e Vídeo Programático

- **Framer Motion + Cult UI:** gerenciam a transição de layout (`layoutId`) do `ExpandableScreen` ao expandir um card de projeto para tela cheia e o escalonamento (*stagger* de 60–80 ms) na entrada dos setores.
- **Remotion (`@remotion/player`):** gerencia todas as animações complexas baseadas em timeline (blueprints de arquitetura do Manfrota e do Arduino Clip, além do efeito de ignição). Deve ser carregado dinamicamente (`next/dynamic` com `ssr: false`) apenas quando o usuário abre o projeto ou o setor correspondente.
- **React Bits:** aplica microinterações cirúrgicas (`DecryptedText` na troca de título, `ClickSpark` nos cliques principais, `SpotlightCard` no hover dos projetos).
- **Orçamento de Performance:** animar apenas `transform` e `opacity`. Nunca animar propriedades que disparem reflow (`width`, `height`, `top`, `left`).
- **Cursor Tático (Desktop):** mira de calibração discreta que se alinha aos cantos de elementos clicáveis. **Nunca** ocultar o cursor nativo em inputs de texto ou áreas de leitura.
- **`prefers-reduced-motion: reduce`:** desativa o movimento do `Starfield`, desativa o wipe/stinger de vídeo, pausa o autoplay do `@remotion/player` (exibindo um frame estático completo do diagrama com botão de play manual) e substitui o `DecryptedText` por exibição imediata.
- Todo loop visual contínuo deve **pausar automaticamente** quando a aba do navegador estiver em segundo plano (`document.hidden` / `visibilitychange`).

---

## 9. Arquitetura Técnica

### Stack

- **Next.js** (App Router) + **React** + **TypeScript** (modo estrito).
- **Tailwind CSS** para utilitários + CSS Variables para os tokens do tema Star Wars.
- **Framer Motion** para transições de interface.
- **Cult UI (`ExpandableScreen`)** para os dossiês expansíveis de projetos.
- **Remotion (`remotion` + `@remotion/player`)** para diagramas técnicos animados e vídeos em código.
- **React Bits** para animações de texto, fundo estelar e faíscas de clique.
- **Zustand** para o gerenciamento de estado do cockpit.
- Qualidade: ESLint, Prettier, Playwright + `@axe-core/playwright` (testes automatizados de acessibilidade).
- Deploy: **Vercel**.

### Estrutura de Pastas

```text
taldosatis-portfolio/
├─ SPEC.md
├─ PENDENCIAS.md                  # lista do que falta o Esaú fornecer
├─ public/
│  ├─ video/stinger.webm          # VP9 + alfa (já existente do Esaú)
│  ├─ fonts/aurebesh.woff2        # fonte decorativa para selos (aria-hidden)
│  ├─ img/                        # avatar, capturas de projetos (WebP/AVIF)
│  ├─ cv/esau-curriculo.pdf
│  └─ favicon / ícones
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # fontes, metadata, JSON-LD, theme-color
│  │  ├─ page.tsx                 # o palco / cockpit (stage)
│  │  ├─ direto/page.tsx          # versão direta (Rebel Data Pad)
│  │  ├─ not-found.tsx            # 404 Arquivos Jedi Incompletos
│  │  ├─ opengraph-image.tsx      # OG dinâmica (next/og)
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ api/
│  │     ├─ twitch/status/route.ts
│  │     └─ github/contributions/route.ts
│  ├─ remotion/                   # Composições Remotion (@remotion/player)
│  │  ├─ HyperspaceBoot.tsx
│  │  ├─ ManfrotaGeminiPipeline.tsx
│  │  └─ ArduinoClipPipeline.tsx
│  ├─ components/
│  │  ├─ cult-ui/
│  │  │  └─ expandable-screen.tsx # Componente ExpandableScreen do Cult UI
│  │  ├─ react-bits/
│  │  │  ├─ DecryptedText.tsx
│  │  │  ├─ Starfield.tsx
│  │  │  ├─ ClickSpark.tsx
│  │  │  └─ SpotlightCard.tsx
│  │  ├─ stage/   (Stage, StingerOverlay, SceneFrame, StarWarsWipe)
│  │  ├─ hud/     (HudBar, LiveBadge, SoundToggle, LocaleToggle)
│  │  ├─ deck/    (SceneDeck, DeckButton, ClipButton)
│  │  ├─ chat/    (ChatDock, ChatMessage, ChatInput)
│  │  ├─ alerts/  (AlertHost, AlertToast)
│  │  ├─ scenes/  (Intro, About, Projects, Stack, Lab, Contact)
│  │  └─ ui/      (TacticalButton, Tag, ChamferPanel, SkipLink ...)
│  ├─ content/
│  │  ├─ pt.ts                    # textos PT-BR
│  │  ├─ en.ts                    # textos EN (v1.1)
│  │  ├─ projects.ts              # estudos de caso tipados
│  │  └─ chat.ts                  # banco de mensagens Holo-Comms por setor
│  ├─ lib/
│  │  ├─ scenes.ts                # ids, ordem, coordenadas, atalhos
│  │  ├─ chat-engine.ts
│  │  ├─ sound.ts                 # Web Audio API (sons de droide/cockpit)
│  │  ├─ twitch.ts
│  │  ├─ github.ts
│  │  └─ a11y.ts                  # anúncios aria-live e controle de foco
│  ├─ store/stage.ts
│  ├─ hooks/                      # useReducedMotion, useHashScene, useKeyboardNav
│  └─ styles/globals.css          # tokens Rebel Tactical UI e utilitários de chanfro
└─ tests/                         # playwright + axe
```

### Modelo de Dados dos Projetos (`src/content/projects.ts`)

```ts
export type Project = {
  id: string;
  missionCode: string;      // ex.: "MISSION_01 // SECTOR_FLEET"
  title: string;
  role: string;
  period: string;
  summary: string;          // 1-2 frases diretas
  problem: string;
  actions: string[];        // arquitetura e o que foi construído
  remotionBlueprint?: "manfrota-gemini" | "arduino-clip" | "loveon-ar";
  results: { label: string; value: string }[]; // somente valores reais ou placeholders explícitos
  stack: string[];
  links: { label: string; href: string }[];
  media?: { type: "image" | "video"; src: string; alt: string }[];
  visibility: "public" | "partial" | "internal";
};
```

Todo conteúdo textual vem de `src/content/*`. Componentes **nunca** devem ter texto em português hardcoded diretamente no JSX.

---

## 10. Criar o Projeto do Zero

Execute na pasta onde o projeto ficará (Windows/PowerShell, WSL ou Git Bash):

```bash
npx create-next-app@latest taldosatis-portfolio --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd taldosatis-portfolio

# Dependências principais + Remotion + Utilitários de UI
npm i framer-motion zustand clsx tailwind-merge lucide-react remotion @remotion/player

# Qualidade e Testes Automatizados
npm i -D prettier @playwright/test @axe-core/playwright

git init
git add -A && git commit -m "chore: bootstrap do terminal tático taldosatis"
```

Depois:

1. Carregar as diretrizes da skill `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`.
2. Copiar este arquivo para `SPEC.md` na raiz.
3. Criar `PENDENCIAS.md` com a lista da seção 21.
4. Configurar as fontes (`Chakra Petch`/`Space Grotesk`, `JetBrains Mono`, `Plus Jakarta Sans`) via `next/font` e os tokens em `src/styles/globals.css`.
5. Implementar os blocos base do **Cult UI** (`ExpandableScreen`), **React Bits** e **Remotion**.

---

## 11. Versão Direta (`/direto` — Rebel Data Pad)

Inspirada no botão "Portfólio direto" da referência 1.

- Página **estática (SSG)**, sem tela de boot, sem wipe de cena, sem chat simulado, sem animações de fundo. Extremamente rápida, semântica e **formatada para impressão / salvar como PDF**.
- Visual: mantém a identidade tipográfica e de cores do tema (*Rebel Data Pad* técnico), com opção de leitura clara no momento da impressão (`@media print`).
- Conteúdo completo em página única: cabeçalho com contatos rápidos, resumo profissional, os 4+ estudos de caso detalhados (problema, arquitetura, resultados e links), tabela técnica de stack, formação e link direto para o PDF do currículo.
- Link visível na Cena 0 (Boot), fixo no HUD superior (`[MODO DIRETO]`), no rodapé e acessível pelo comando `!direto` no Holo-Comms.
- É a **versão de segurança e acessibilidade máxima** para: navegação sem JavaScript, conexões móveis instáveis, leitores de tela e recrutadores com pressa.

---

## 12. Acessibilidade (WCAG 2.2 AA como meta obrigatória)

- `SkipLink` ("Pular para o conteúdo principal do setor") visível no primeiro `Tab`.
- HTML semântico rigoroso: `header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`.
- Todo o cockpit — incluindo a abertura e fechamento do **`ExpandableScreen` (Cult UI)** e os controles do **`@remotion/player`** — deve ser **100% operável apenas por teclado**, com ordem de foco lógica e `:focus-visible` em Âmbar Rebelde (`#FF9F1C`).
- Quando um estudo de caso estiver expandido via `ExpandableScreen`, o foco deve ficar contido dentro do modal (`focus trap`), a tecla `Esc` deve fechá-lo e o foco deve retornar exatamente ao card que o abriu.
- Textos decorativos em **Aurebesh** devem ter obrigatoriamente `aria-hidden="true"`.
- Efeito `DecryptedText` (React Bits) deve manter o texto real acessível para leitores de tela desde o primeiro frame (usando `sr-only` para o texto real e `aria-hidden="true"` para os caracteres embaralhados).
- Anúncios de troca de setor via `aria-live="polite"`. O terminal Holo-Comms não deve anunciar mensagens automaticamente.
- Alvos de toque ≥ 44×44 px.
- Zero conteúdo que pisque mais de 3 vezes por segundo.
- Testes automatizados com `@axe-core/playwright` sem violações sérias ou críticas.

---

## 13. Performance (Metas)

- Lighthouse (mobile, throttling padrão): **Performance ≥ 90, Acessibilidade ≥ 95, Boas Práticas ≥ 95, SEO ≥ 95** na home e **≥ 95 em todas as métricas** na rota `/direto`.
- Core Web Vitals: LCP < 2,5 s · CLS < 0,1 · INP < 200 ms.
- **Lazy Loading rigoroso do Remotion:** o pacote `@remotion/player` e as composições de vídeo em React só devem ser baixados no cliente quando o usuário abrir um estudo de caso ou entrar no Setor 5 (`next/dynamic`).
- Imagens em AVIF/WebP via `next/image`, com `sizes` definidos.
- Vídeo de stinger (`.webm`) e síntese de áudio inicializados em *idle* (`requestIdleCallback`), nunca bloqueando o carregamento inicial.
- Evitar *layout shift* (CLS) reservando dimensões fixas para o `DecryptedText`, imagens e container do chat.

---

## 14. SEO e Compartilhamento

- `metadata` completo no App Router: `title`, `description`, `canonical`, `openGraph`, `twitter` (`summary_large_image`), `themeColor` (`#07080A`).
- **OG Image Dinâmica (`opengraph-image.tsx`):** visual de terminal tático da Aliança Rebelde com o nome **ESAÚ SANTANA**, cargo e selo `● HOLONET TRANSMISSION // TALDOSATIS`.
- **JSON-LD (`Person`):** nome, `jobTitle` ("Full Stack Developer"), `url`, `sameAs` (GitHub, LinkedIn, Twitch).
- `sitemap.xml` e `robots.txt` gerados dinamicamente.
- Conteúdo textual dos setores presente no HTML inicial renderizado no servidor (SSR/SSG) para indexação perfeita por buscadores e recrutadores.

---

## 15. Internacionalização (v1.1)

- PT-BR como idioma padrão (`/`); EN opcional (`/en`) via chave seletora no HUD (`PT // EN`), mantendo a mesma arquitetura de setores.
- Dicionários estritamente tipados em `src/content/pt.ts` e `src/content/en.ts`.

---

## 16. Responsivo e Mobile

- Mobile-first real. O palco utiliza `100dvh` com suporte a `env(safe-area-inset-*)`.
- No celular, o Deck de Setores vira uma **barra tática inferior fixa** com ícones e códigos curtos (`01 INTRO`, `02 SOBRE`, `03 MISSÕES`...); o terminal Holo-Comms vira uma gaveta acionável no topo.
- O componente **`ExpandableScreen` (Cult UI)** ocupa 100% da viewport no mobile com botão de fechar (`[X // FECHAR DOSSIÊ]`) fixo e fácil de alcançar com o polegar.
- Setores densos (Projetos, Arsenal) possuem scroll interno suave enquanto o HUD superior e o Deck inferior permanecem ancorados.
- Testar obrigatoriamente nas larguras: `360px`, `390px`, `768px`, `1024px`, `1440px` e `1920px`.

---

## 17. Variáveis de Ambiente e Integrações

Arquivo `.env.local` (nunca commitar) e configuração no painel da Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://<dominio>
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
GITHUB_TOKEN=            # token clássico ou fine-grained somente leitura para GraphQL
GITHUB_USERNAME=
```

- Commitar um arquivo `.env.example` documentando as chaves necessárias (sem valores).
- Chaves secretas (`TWITCH_CLIENT_SECRET`, `GITHUB_TOKEN`) **jamais** podem ter o prefixo `NEXT_PUBLIC_` e só devem ser lidas nas rotas de servidor (`src/app/api/*`).
- Tratamento de erro gracioso: se as variáveis estiverem vazias em ambiente de desenvolvimento, exibir dados de fallback sinalizados como `[TELEMETRIA EM MODO OFFLINE]` sem quebrar o build nem gerar erros no console.

---

## 18. Deploy

- Repositório no GitHub conectado à Vercel (Preview automático por Pull Request e Produção na branch `main`).
- Domínio personalizado `[PREENCHER]` com HTTPS e redirecionamento canônico.
- Validação pós-deploy: testar preview do Open Graph (WhatsApp, LinkedIn, Discord, X), rodar Lighthouse em produção, testar links diretos com hash (`/#projetos`) e validar o funcionamento da página `/direto`.

---

## 19. Fases de Execução e Checklist

### Fase 1 — Fundação, Skill UI/UX e Data Pad (`/direto`)
- [ ] Carregar diretrizes da `ui-ux-pro-max-skill`.
- [ ] Projeto Next.js criado (seção 10) com Remotion, Framer Motion e Zustand instalados.
- [ ] Tokens "Rebel Tactical UI", fontes e utilitários de chanfro configurados em `globals.css`.
- [ ] Conteúdo tipado em `src/content/*` com placeholders explícitos e criação do `PENDENCIAS.md`.
- [ ] Página `/direto` (*Rebel Data Pad*) 100% funcional, responsiva, acessível e imprimível.

### Fase 2 — O Cockpit, Cult UI e React Bits
- [ ] Store global do palco (`stage.ts`), `scenes.ts`, sincronização de `#hash` e navegação completa por teclado (`1`–`6`, setas, `Esc`).
- [ ] Componentes do **React Bits** implementados (`Starfield`, `DecryptedText`, `ClickSpark`, `SpotlightCard`).
- [ ] HUD superior (status de transmissão, uptime, coordenadas) e Deck Tático de Setores.
- [ ] Setor 0 (Sequência de Ignição) e estrutura dos 6 setores navegáveis com transição Star Wars Wipe / Stinger.
- [ ] Implementação do **`ExpandableScreen` (Cult UI)** no Setor 3 (Projetos) abrindo os estudos de caso em tela cheia.

### Fase 3 — Blueprints em Remotion e Vida no Terminal
- [ ] Criação das composições no **Remotion** (`ManfrotaGeminiPipeline.tsx`, `ArduinoClipPipeline.tsx`, `HyperspaceBoot.tsx`) e integração via `@remotion/player` dentro dos dossiês do `ExpandableScreen` e no Setor 5 (`#lab`).
- [ ] Terminal Holo-Comms (chat simulado) funcionando com comandos (`!projetos`, `!stack`, `!direto`, `!ordem66`, etc.) e rótulo claro de simulação.
- [ ] Sistema de Alertas Táticos, botão **GRAVAR HOLOCRON** (copiar link do setor) e conquistas de exploração.
- [ ] Sintetizador de áudio Web Audio API (bipes de droide astromecânico e cliques de painel, desligado por padrão).

### Fase 4 — Integrações Reais e Prova Técnica
- [ ] Revisão final dos 4 estudos de caso com métricas reais, links e diagramas.
- [ ] Integração da API da Twitch (`/api/twitch/status`) + player embutido quando ao vivo.
- [ ] Integração da API GraphQL do GitHub (`/api/github/contributions`) renderizando o Radar Galáctico de Commits.

### Fase 5 — Acabamento, Auditoria Anti-IA e Aceite Final
- [ ] Auditoria visual rigorosa com a `ui-ux-pro-max-skill` para garantir **zero aparência genérica de IA**.
- [ ] SEO completo, Open Graph dinâmico (`opengraph-image.tsx`), JSON-LD, `sitemap.ts` e `robots.ts`.
- [ ] Bateria de testes de acessibilidade (`@axe-core/playwright`, navegação exclusiva por teclado e teste de `prefers-reduced-motion`).
- [ ] Otimização de performance até atingir as metas do Lighthouse (seção 13).
- [ ] Página 404 temática ("Arquivos Jedi Incompletos") e easter eggs (Konami Code Imperial).

---

## 20. Critérios de Aceite (Definição de Pronto)

1. **Identidade Visual Forte (Zero Cara de IA):** o site transmite imediatamente a estética de um terminal tático analógico de Star Wars operado por um engenheiro de software e streamer, sem usar clichês visuais de templates gerados por IA.
2. **Bibliotecas Integradas com Propósito:**
   - **Cult UI (`ExpandableScreen`)** expandindo os estudos de caso de forma fluida e acessível.
   - **Remotion (`@remotion/player`)** exibindo os diagramas animados de arquitetura dentro dos projetos e no laboratório.
   - **React Bits** aplicado nos títulos (`DecryptedText`), fundo (`Starfield`), cards (`SpotlightCard`) e cliques (`ClickSpark`).
3. **Acesso Imediato:** o visitante entende o posicionamento do Esaú em menos de 5 segundos e encontra facilmente o botão para a versão `/direto`.
4. **Teclado e Sem JS:** é possível ler todo o portfólio sem JavaScript na rota `/direto` e operar 100% do cockpit interativo usando apenas o teclado.
5. **Honestidade Técnica:** nenhum número, cliente ou métrica inventada. Tudo que depender de confirmação está documentado em `PENDENCIAS.md`.
6. **Performance e Movimento Reduzido:** Lighthouse cumprindo as metas da seção 13; `prefers-reduced-motion` desativando animações contínuas, wipes pesados e autoplay de vídeos.
7. **Compatibilidade Cross-Browser:** testado e funcional no Chrome, Firefox, Safari (macOS/iOS) e Android, com fallback do stinger funcionando perfeitamente no Safari.

---

## 21. O que o Esaú precisa fornecer (`PENDENCIAS.md`)

- [ ] Foto/avatar para o Holo-Projetor do Setor 1 e, se houver, foto real do setup/botão Arduino.
- [ ] Texto validado do Setor 2 ("Sobre") e marcos reais da linha do tempo; confirmar modalidade buscada (vagas CLT/PJ, freelance, remoto).
- [ ] **Manfrota:** confirmar quais métricas reais de redução de custo/latência com o Google Gemini e Redis podem ser exibidas publicamente.
- [ ] **Projetos Freelance / Restaurantes:** confirmar se DAMA Pizzaria, Eduarda Cozinha e Vinhos e Create Plate entram como clientes entregues ou estudos de caso/propostas, e fornecer as URLs/capturas.
- [ ] **LoveOn & Stream Lab:** confirmar URLs finais de produção, repositórios públicos e vídeos curtos do botão de clip em Arduino funcionando.
- [ ] Arquivo de vídeo do **stinger** (`.webm` VP9 com alfa) caso queira usar o arquivo original além da transição Star Wars Wipe / Remotion.
- [ ] Links definitivos de contato: E-mail, WhatsApp, LinkedIn, GitHub (usuário exato) e Twitch (`taldosatis`).
- [ ] Credenciais para `.env.local`: `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` e `GITHUB_TOKEN` (somente leitura).
- [ ] Arquivo final do currículo em PDF (`public/cv/esau-curriculo.pdf`).
- [ ] Domínio final para configuração de canonical e Open Graph.

---

## 22. Prompt Inicial para o Agente (Copiar e Colar)

```text
Você vai construir do zero o portfólio do Esaú Santana, seguindo rigorosamente o arquivo SPEC.md na raiz deste projeto.

Antes de escrever qualquer linha de código:
1. Carregue e aplique as diretrizes da skill de UI/UX: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
2. Leia o SPEC.md inteiro e consulte a documentação oficial das bibliotecas obrigatórias do projeto:
   - Cult UI (ExpandableScreen): https://www.cult-ui.com/docs/components/expandable-screen
   - Remotion: https://github.com/remotion-dev/remotion
   - React Bits: https://reactbits.dev
3. Abra e analise as 3 referências de nível listadas na seção 2 (portfolio-un.vercel.app, portfolio-lia-lourenco.vercel.app, ofelipemart.gevia.co) observando arquitetura de navegação, animações, performance, acessibilidade e estrutura de estudos de caso. Não copie código nem textos.
4. Resuma em até 15 linhas o plano de execução da Fase 1 e gere o arquivo PENDENCIAS.md.

Regras Inegociáveis:
- PROIBIDO estética genérica de IA (gradientes roxos/ciano neon, cards arredondados genéricos com blur excessivo, textos clichês de ChatGPT).
- Tema: "HOLONET TACTICAL TERMINAL" — Star Wars Analógico / Cassete Futurista (inspirado nos terminais da Aliança Rebelde em Andor e Rogue One), unindo a engenharia Full Stack do Esaú (Manfrota, LoveOn, Create Plate) com o laboratório da sua live na Twitch (taldosatis).
- Use Cult UI (ExpandableScreen) na Cena 3 para expandir os cards de projetos em dossiês táticos de tela cheia.
- Use Remotion (@remotion/player) para criar blueprints animados de arquitetura (como o pipeline NestJS + Redis + Gemini do Manfrota e o pipeline Arduino + Python + FFmpeg da live) dentro dos estudos de caso e na Cena 5.
- Use React Bits (DecryptedText, Starfield, ClickSpark, SpotlightCard) para microinterações táticas.
- Crie o projeto com os comandos da seção 10 e entregue por fases (seção 19), validando os critérios de aceite (seção 20) ao fim de cada fase.
- Entregue arquivos completos e prontos para produção (nunca entregue trechos incompletos com comentários "// resto do código").
- Nunca invente números, clientes ou depoimentos: use placeholders técnicos visíveis e registre tudo em PENDENCIAS.md.
- Todo texto deve vir tipado de src/content/*. Acessibilidade (WCAG 2.2 AA), prefers-reduced-motion e performance (Lighthouse >= 90) são requisitos bloqueantes.
- Comece agora pela Fase 1, entregando o setup completo, o Design System "Rebel Tactical UI" em globals.css, os componentes base e a versão /direto (Rebel Data Pad) 100% funcional.
```