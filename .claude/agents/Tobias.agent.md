```markdown
# AGENT.md — Instruções para Agente de IA no projeto MoverJogar

## Visão geral do projeto

**MoverJogar** é o backend de uma plataforma de jogos sérios para fisioterapia.
Associa pacientes a fisioterapeutas, recebe resultados de sessões do **Meta Quest 3** via **MQTT**, persiste o histórico no **MySQL** e expõe os dados para a interface web via **HTTP**.

### Responsabilidade do backend
O backend **NÃO** executa lógica de jogo nem calcula *high score*. Ele apenas:
1. Recebe os valores enviados pelo dispositivo via MQTT
2. Identifica o paciente pelo tópico MQTT (`metaquest/{pacienteId}/dados`)
3. Registra uma nova sessão no banco

**Nunca implemente regras de gameplay/pontuação no backend.**

---

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 (declarado no `pom.xml` — **atenção**: Dockerfile usa Java 17, precisa ser alinhado) |
| Framework | Spring Boot 3.2.4 |
| Persistência | Spring Data JPA + MySQL 8, `ddl-auto=validate` |
| Migrations | Flyway |
| Pool de conexão | HikariCP |
| Mensageria | MQTT (Spring Integration), broker `ws://mqtt.ect.ufrn.br:1884/mqtt` |
| Build | Maven (sem wrapper `mvnw` no repo) |
| Containerização | Docker / Docker Compose |

---

## Fluxo de uma sessão (MQTT)

1. Jogo publica JSON em `metaquest/{pacienteId}/dados`
2. Backend extrai `{pacienteId}` **do tópico** — o `pacienteId` do corpo é ignorado/sobrescrito
3. JSON convertido para `sessaoDTO`
4. Se `dataSessao` ausente, usa `LocalDateTime.now()` do servidor
5. Verifica existência do paciente; se não existir, loga erro e **descarta** (não persiste, não responde no MQTT)
6. Salva sessão em `tb_sessao` com `sessaoId=0` (banco gera o ID real)

**Payload esperado (`sessaoDTO`):**
```json
{
  "dataSessao": "2026-08-21T14:30:00",
  "highScore": 875.5,
  "coletaveis": "moeda, estrela, trofeu",
  "tempoSessao": 900
}
```
Todos os campos são opcionais exceto o que o tópico já garante (`pacienteId`).

---

## API HTTP (base: `/api/metaquest`)

| Endpoint | Método | Descrição |
|---|---|---|
| `/login` | POST | `{email, senha}` → `200` texto ou `401`. Sem token/sessão. |
| `/cadastrar` | POST | `{nome, fisioId}` → `201` com entidade paciente (⚠️ retorna entidade JPA, não DTO) |
| `/{emailDoFisio}/meus-pacientes` | GET | Lista pacientes + `historicoSessoes` (via `@EntityGraph`) |

CORS liberado para qualquer origem (`@CrossOrigin(originPatterns = "*")`) — **restringir em produção**.

---

## Modelo de dados

```
tb_fisio (id, nome, email, senha texto puro)
   1---N
tb_paciente (id, nome, fisio_id)
   1---N
tb_sessao (id, paciente_id, data_sessao, high_score, coletaveis, tempo_sessao)
```

Migration inicial (`V2`) cria usuário seed: `rummenigge@clinica.com` / senha `123`.

---

## Estrutura de pacotes

| Pacote | Responsabilidade |
|---|---|
| `controller` | Endpoints REST |
| `listener` | Consumo/parse de mensagens MQTT |
| `config` | Cliente MQTT, broker, tópicos, canais |
| `service` | Regras de login, cadastro, sessões |
| `repository` | Spring Data JPA |
| `model` | Entidades (`fisioData`, `pacienteData`, `sessaoData`) |
| `dto` | Objetos de entrada/saída |
| `resources/db/migration` | Migrations versionadas Flyway |

---

## Regras para o agente de IA

### Escopo
- Trabalhar só na camada backend (REST, MQTT, persistência). Nunca implementar cálculo de pontuação/gameplay.
- Ao tratar mensagens MQTT: sempre extrair `pacienteId` do **tópico**, nunca confiar no corpo do payload para essa finalidade.

### Migrations (Flyway)
- Nunca editar migrations já aplicadas (`V1` a `V4` existentes). Criar sempre uma nova (`V5__descricao.sql`, etc.).
- Manter `ddl-auto=validate` — qualquer mudança de schema precisa vir acompanhada de migration correspondente.

### Segurança — pontos já conhecidos como pendências (priorizar se solicitado)
- Senha de fisioterapeuta em **texto puro**: se for pedido para melhorar segurança, migrar para BCrypt e ajustar login/migrations.
- Login não gera token/sessão — se implementar autenticação real, considerar JWT ou Spring Security, mantendo compatibilidade com contrato atual a menos que pedido explicitamente para quebrar.
- CORS `*` — sinalizar/restringir se tema for segurança ou deploy em produção.
- Credenciais de MySQL e broker MQTT hardcoded em `application.properties`/Compose — mover para variáveis de ambiente quando trabalhar em infraestrutura.

### Débitos técnicos conhecidos (não resolver silenciosamente, mas ciente ao tocar no código)
- `mqttStatusInputChannel` referenciado no listener sem adapter MQTT configurado — status Online/Offline só loga, não persiste.
- `salvarDados` em `pacienteService` não aplica os dados recebidos e não está exposto por controller — código morto/incompleto.
- Dockerfile com Java 17 vs `pom.xml` com Java 21 — alinhar antes de build de produção.
- `/cadastrar` retorna entidade JPA diretamente (risco de ciclo de serialização com relacionamentos bidirecionais) — se for tocar nesse endpoint, considerar retornar DTO.
- Não há testes automatizados em `src/test` e não há `mvnw`. Ao adicionar testes, usar Maven padrão (`mvn test`) e considerar Testcontainers/H2 para isolar do MySQL real.
- Sem validação de payload MQTT nem tratamento HTTP padronizado de exceções (ex: cadastro com `fisioId` inexistente tende a gerar `500` em vez de `404`/`400`).

### Docker / Infra
- Serviço do banco no Compose se chama `db`; API usa `SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/moverjogar_db`.
- **Sempre garantir `healthcheck` no serviço `db` + `depends_on: db: condition: service_healthy` na API** — já houve incidente de restart loop (`UnknownHostException: db`) por falta disso.
- Sincronizar senha entre `MYSQL_ROOT_PASSWORD` (serviço `db`) e `SPRING_DATASOURCE_PASSWORD` (serviço `api`).

### API REST
- Seguir padrão de resposta já existente (textos simples em login, entidades em cadastro) a menos que a tarefa peça refatoração explícita — não alterar contratos existentes sem necessidade.
- Novos endpoints devem preferir DTOs de saída, evitando expor entidades JPA com relacionamentos bidirecionais.

### Testes
- Ao adicionar funcionalidade nova, criar testes em `src/test` (Maven padrão). Priorizar isolamento de banco (H2 ou Testcontainers) em vez do MySQL de dev.

---

## Checklist antes de finalizar uma tarefa

- [ ] Não implementei lógica de jogo/pontuação no backend
- [ ] `pacienteId` em fluxo MQTT extraído do tópico, não do payload
- [ ] Migration nova criada (nunca editei uma existente), se houve mudança de schema
- [ ] Credenciais não hardcoded no código-fonte (usar env vars quando possível)
- [ ] Se toquei no Compose: healthcheck do `db` e `depends_on: condition: service_healthy` mantidos/configurados
- [ ] Senhas do MySQL sincronizadas entre `db` e `api` no Compose
- [ ] Endpoints novos retornam DTO, não entidade JPA diretamente
- [ ] Testes cobrindo a mudança (Maven padrão, `mvn test`)
- [ ] Não quebrei contratos existentes da API sem indicação explícita da tarefa
```
