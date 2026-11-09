# Guaraci Telemedicina Frontend

Frontend web da aplicação de telemedicina da Guaraci, responsável por exibir o painel do fisioterapeuta, gerenciar pacientes, iniciar sessões, acompanhar transmissões em tempo real e consultar dados do perfil.

## Visão geral

Este projeto é uma interface estática em HTML, CSS e JavaScript, sem framework ou bundler. A aplicação se conecta com uma API backend em `http://localhost:8080/api/metaquest` e controla diversas telas e interações do fluxo clínico.

## Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Fetch API para comunicação com o backend
- SockJS e STOMP (via CDN) e WebRTC para a transmissão ao vivo
- LocalStorage para persistência simples de sessão no navegador

## Estrutura do projeto

```text
src/GuaraciWeb/lapidar/
├── index.html
├── README.md
├── assets/
│   ├── icons/
│   └── logo/
├── fonts/
├── css/
│   ├── consultations.css
│   ├── fonts.css
│   ├── global.css
│   ├── header.css
│   ├── layout.css
│   ├── live.css
│   ├── patient.css
│   ├── profile.css
│   ├── realtime.css
│   ├── reset.css
│   ├── sidebar.css
│   └── variables.css
└── js/
    ├── api.js
    ├── live.js
    ├── main.js
    ├── patient.js
    ├── profile.js
    ├── realtime.js
    └── session.js
```

## Principais módulos

- `js/main.js`: inicializa a aplicação ao carregar a página
- `js/api.js`: centraliza as requisições HTTP para a API
- `js/patient.js`: dados do paciente e carregamento da lista do fisioterapeuta
- `js/session.js`: formulário "Entrar na sessão" e início da transmissão
- `js/realtime.js`: timeline de atividade em tempo real
- `js/profile.js`: perfil do profissional
- `js/live.js`: fluxo de live/atendimento (WebSocket/STOMP e WebRTC)

## Requisitos

- Navegador moderno
- Backend em execução na porta `8080`
- A API deve responder em:
  - `http://localhost:8080/api/metaquest`

## Como executar

A partir da pasta do frontend:

```bash
cd src/GuaraciWeb/lapidar
python3 -m http.server 8000
```

Em seguida, abra no navegador:

```text
http://localhost:8000
```

> Recomendado: usar um servidor local em vez de abrir o `index.html` diretamente, para evitar problemas de carregamento de módulos e caminhos de assets.

## Identidade visual

- **Cores:** definidas em `css/variables.css` (variáveis `--color-*`). Altere as cores por lá, e não com valores soltos nos outros arquivos CSS.
- **Fontes:** Nexa (corpo do texto) e Novecento Sans Wide (títulos), carregadas por `css/fonts.css`.
- **Ícones e logo:** arquivos PNG em `assets/icons/` e `assets/logo/`.

### Arquivos de fonte

Os arquivos das fontes **não estão versionados** no repositório. Para ver a tipografia correta, copie-os para a pasta `fonts/` (ao lado de `css/`) com estes nomes, em `.otf` ou `.ttf`:

- `Nexa-ExtraLight`
- `Nexa-Heavy`
- `Novecentosanswide-Light`
- `Novecentosanswide-Normal`
- `Novecentosanswide-DemiBold`

Sem eles, o navegador usa uma fonte reserva (Inter ou a fonte padrão do sistema).

## Configuração da API

O cliente API está definido em `js/api.js` com:

```js
const API_BASE_URL = "http://localhost:8080/api/metaquest";
```

O `js/live.js` mantém suas próprias constantes (`API_URL` e `WEBSOCKET_URL`). Se a API estiver em outra porta ou domínio, ajuste esse valor em `js/api.js` e também em `js/live.js` antes de rodar a aplicação.

## Fluxo principal

1. O usuário acessa a interface.
2. O sistema carrega os módulos de paciente, sessão, perfil e transmissão.
3. O fisioterapeuta pode informar o email no query string (`?email=...`) para persistir no `localStorage`.
4. O frontend realiza chamadas para o backend para buscar ou registrar pacientes e iniciar a sessão.

## Observações importantes

- A aplicação depende de um backend funcional para login, cadastro e transmissão.
- O código é modular e usa ES modules, então a página deve ser servida por um ambiente HTTP.
- O uso de `localStorage` é simples e serve para manter o contexto do profissional no navegador.

## Desenvolvimento

Para evoluir a interface:

- mantenha a organização por módulos em `js/`
- adicione estilos em `css/` seguindo o padrão já existente
- ajuste a marcação em `index.html` apenas quando necessário para nova estrutura
- valide a comunicação com o backend antes de alterar regras de negócio na interface

## Contribuição

Siga a convenção já usada no projeto:

- nomes de arquivos em minúsculas e sem espaços
- uso de classes semânticas em CSS
- funções de inicialização por módulo
- leitura e escrita em `localStorage` apenas quando houver necessidade explícita de contexto do usuário

## Licença

Este projeto não define uma licença específica no momento.
