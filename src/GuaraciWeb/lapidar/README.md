# Lapidar Telemedicina Frontend

Frontend web da aplicação de telemedicina da Lapidar, responsável por exibir o painel do fisioterapeuta, gerenciar pacientes, iniciar sessões, acompanhar transmissões em tempo real e consultar dados do perfil.

## Visão geral

Este projeto é uma interface estática em HTML, CSS e JavaScript, sem framework ou bundler. A aplicação se conecta com uma API backend em `http://localhost:8080/api/metaquest` e controla diversas telas e interações do fluxo clínico.

## Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Fetch API para comunicação com o backend
- LocalStorage para persistência simples de sessão no navegador

## Estrutura do projeto

```text
src/GuaraciWeb/lapidar/
├── index.html
├── README.md
├── assets/
│   └── logo/
├── css/
│   ├── consultations.css
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
- `js/patient.js`: gerenciamento de pacientes
- `js/session.js`: início da transmissão/sessão
- `js/realtime.js`: integração em tempo real
- `js/profile.js`: perfil do profissional
- `js/live.js`: fluxo de live/atendimento

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

## Configuração da API

O cliente API está definido em `js/api.js` com:

```js
const API_BASE_URL = "http://localhost:8080/api/metaquest";
```

Se a API estiver em outra porta ou domínio, ajuste esse valor antes de rodar a aplicação.

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
