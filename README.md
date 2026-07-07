<p align="center">
  <img alt="Capa do Projeto" src="./capa.png" width="80%">
</p>

# TaskFlow API

API REST para gerenciamento de tarefas desenvolvida com **Node.js**, **Express**, **TypeScript** e **PostgreSQL**.

O sistema permite autenticação utilizando JWT, gerenciamento de usuários, equipes e tarefas, além de controlar permissões de acesso entre administradores e membros.

---

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Docker
- JWT
- Zod
- Vitest
- Supertest

---

# 📋 Funcionalidades

## 🔐 Autenticação

- Cadastro de usuários
- Login
- Autenticação utilizando JWT

## 👥 Usuários

- Criar usuário
- Remover usuário

## 👨‍💻 Times

- Criar time
- Atualizar time
- Listar times
- Buscar time por ID
- Remover time
- Adicionar membros
- Remover membros

## ✅ Tarefas

- Criar tarefa
- Listar tarefas
- Buscar tarefa por ID
- Atualizar tarefa
- Excluir tarefa
- Alterar status
- Atribuir tarefa para um membro

## 📜 Histórico

- Consultar histórico de alterações de status das tarefas

---

# 🔑 Controle de acesso

### Administrador

- Criar usuários
- Gerenciar usuários
- Criar equipes
- Editar equipes
- Remover equipes
- Adicionar membros aos times
- Remover membros dos times
- Gerenciar todas as tarefas

### Membro

- Visualizar tarefas atribuídas a ele
- Atualizar apenas tarefas atribuídas a ele

---

# 📁 Estrutura do Projeto

```text
src
├── config
├── controller
├── database
├── middleware
├── routes
├── test
├── utils
├── server.ts
└── app.ts
```

---

# 🗄 Banco de Dados

O banco foi modelado utilizando Prisma ORM.

## Entidades

- Users
- Teams
- Team Members
- Tasks
- Tasks History

### Relacionamentos

```text
User
├── TeamMember
├── Task
└── TaskHistory

Team
├── TeamMember
└── Task

Task
└── TaskHistory
```

---

# ⚙️ Como executar o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/Matheus-Souza97/taskflowAPI.git



cd taskflow
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow"

JWT_SECRET=uma_chave_super_secreta

PORT=3333
```

---

## 4. Inicie o banco de dados com Docker

```bash
docker compose up -d
```

Verifique se o container está em execução:

```bash
docker ps
```

---

## 5. Execute as migrations

```bash
npx prisma migrate dev
```

---

## 6. Gere o Prisma Client

```bash
npx prisma generate
```

---

## 7. Execute a aplicação

Modo desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em

```
http://localhost:3333

```

---

# 🧪 Executando os testes

Executar todos os testes

```bash
npm test
```

Modo Watch

```bash
npm run test:dev
```

Cobertura dos testes

> Os testes utilizam um banco de dados específico para testes.

---

# 🔐 Autenticação

As rotas protegidas utilizam JWT.

Envie o token no Header.

```http
Authorization: Bearer SEU_TOKEN
```

---

# 📌 Endpoints

## Usuários

### Criar usuário

**POST** `/users`

Body

```json
{
  "name": "Admin",
  "email": "admin@email.com",
  "password": "123456",
  "role": "admin"
}

Se role não for informado, o usuario e cadastrado como "member"

```

---

### Remover usuário

**DELETE** `/users/:id`

Necessário autenticação.

---

# 🔑 Sessão

### Login

**POST** `/sessions`

Body

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

Resposta

```json
{
  "token": "JWT_TOKEN"
}
```

---

# 👨‍💻 Times

### Criar time

**POST** `/teams`

```json
{
  "name": "Backend",
  "description": "Equipe responsável pela API"
}
```

---

### Listar times

**GET** `/teams`

---

### Atualizar time

**PUT** `/teams/:id`

---

### Excluir time

**DELETE** `/teams/:id`

---

### Adicionar membro

**POST** `/members`

```json
{
  "userId": "uuid",
  "teamId": "uuid"
}
```

---

### Listar membros

**GET** `/members/:userId`

---

### Remover membro

**DELETE** `/members/user/:userId/team/:teamId`

---

# ✅ Tarefas

### Criar tarefa

**POST** `/tasks`

```json
{
  "title": "Criar README",
  "description": "Documentar projeto",
  "priority": "high",
  "status": "pending",
  "assignedTo": "uuid",
  "teamId": "uuid"
}
```

---

### Listar tarefas

**GET** `/tasks`

---

### Atualizar tarefa

**PUT** `/tasks/:id`

```json
{
  "title": "Criar README",
  "description": "Documentar projeto",
  "priority": "high",
  "status": "pending",
  "assignedTo": "uuid",
  "teamId": "uuid"
}
```

---

### Remover tarefa

**DELETE** `/tasks/:id`

---

# 🔍 Filtros de Tarefas

### Filtrar tarefas por prioridade

**GET** `/filterTask/priority`

Parâmetros de consulta (Query Params)

| Parâmetro | Tipo   | Obrigatório | Valores                 |
| --------- | ------ | ----------- | ----------------------- |
| priority  | string | Sim         | `high`, `medium`, `low` |

---

### Filtrar tarefas por status

**GET** `/filterTask/status`

Parâmetros de consulta (Query Params)

| Parâmetro | Tipo   | Obrigatório | Valores                               |
| --------- | ------ | ----------- | ------------------------------------- |
| status    | string | Sim         | `pending`, `in_progress`, `completed` |

---

# 👤 Atualização de Tarefas pelo Membro

Permite que um usuário com perfil **Member** atualize **apenas as tarefas atribuídas ao seu próprio usuário**.

Caso tente atualizar uma tarefa atribuída a outro membro, a requisição será negada.

### Atualizar tarefa atribuída ao membro

**PUT** `/membersTaskUpdate/:id`

Necessário autenticação.

Body

```json
{
  "title": "Atualizar documentação",
  "description": "Finalizar README da aplicação",
  "status": "completed",
  "priority": "medium"
}
```

### Regras de acesso

- Apenas usuários autenticados.
- O membro só pode atualizar tarefas cujo campo `assignedTo` seja igual ao seu `id`.
- Administradores devem utilizar a rota de atualização de tarefas destinada ao gerenciamento geral.

---

# 📜 Histórico

### Histórico de alterações

**GET** `/taskHistory/:id`

---

# 📊 Status das tarefas

| Valor       | Descrição    |
| ----------- | ------------ |
| pending     | Pendente     |
| in_progress | Em progresso |
| completed   | Concluído    |

---

# 🚨 Prioridades

| Valor  | Descrição |
| ------ | --------- |
| high   | Alta      |
| medium | Média     |
| low    | Baixa     |

---

# 📜 Scripts

| Script             | Descrição                       |
| ------------------ | ------------------------------- |
| `npm run dev`      | Executa em desenvolvimento      |
| `npm run build`    | Compila o projeto               |
| `npm start`        | Executa a versão compilada      |
| `npm test`         | Executa todos os testes         |
| `npm run test:dev` | Executa os testes em modo watch |

---

# 🚀 Deploy

A API está disponível em:

```
https://taskflowapi-fak0.onrender.com

```

---

# 👨‍💻 Autor

Desenvolvido por **Matheus Souza**.
