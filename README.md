<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-5.x-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<h1 align="center">Document API</h1>

<p align="center">
  API REST para gerenciamento de documentos | Clean Architecture · DDD · Hexagonal
</p>

<p align="center">
  <a href="#-visão-geral">Visão Geral</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-stack">Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api">API</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-testes">Testes</a>
</p>

---

## 📋 Visão Geral

API REST para CRUD de documentos, desenvolvida como **projeto de portfólio** para demonstrar conhecimentos em arquitetura de software, boas práticas e design de sistemas.

### Destaques do Projeto

| Aspecto | Implementação |
|---------|---------------|
| **Arquitetura** | Clean Architecture + Hexagonal (Ports & Adapters) |
| **Domínio** | DDD com entidades, value objects e casos de uso isolados |
| **Testabilidade** | Inversão de dependência, repositório em memória para testes |
| **Infraestrutura** | Prisma ORM, Fastify, PostgreSQL, Docker |
| **Documentação** | Schemas JSON para validação e tipagem |

### Princípios Aplicados

- **Dependency Rule** — dependências sempre apontam para o centro (domínio)
- **Single Responsibility** — cada camada com responsabilidade única
- **Dependency Inversion** — domínio define portas; infra implementa adaptadores
- **Independência de frameworks** — núcleo desacoplado de Fastify, Prisma etc.

---

## 🧱 Arquitetura

O projeto segue **Clean Architecture** (Robert C. Martin) combinada com **Hexagonal Architecture**, garantindo que o domínio permaneça isolado de detalhes de infraestrutura.

```
                    ┌─────────────────────────────────────────┐
                    │           Infrastructure                │
                    │  (HTTP · Prisma · PostgreSQL · Docker)  │
                    └───────────────────┬─────────────────────┘
                                        │ implements
                                        ▼
┌───────────────┐    ┌─────────────────────────────────────────┐
│   External    │    │              Application                 │
│   Request     │───►│  (DTOs · Mappers · Validações)           │
└───────────────┘    └───────────────────┬─────────────────────┘
                                         │ uses
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │              Domain (Core)               │
                    │  Entities · Use Cases · Ports · Errors   │
                    └─────────────────────────────────────────┘
```

### Camadas

#### 1. Domain (Core)

- **Entidades** — `DocumentEntity` com regras de negócio puras
- **Use Cases** — `CreateDocument`, `ListDocuments`, `UpdateDocumentStatus`, `DeleteDocument`
- **Ports** — `DocumentRepositoryPort` (contrato de persistência)
- **Errors** — `AppError`, `ValidationError` para tratamento centralizado

**Regras:** zero dependências externas, testável em isolamento.

#### 2. Application

- **DTOs** — `CreateDocumentRequestDto`, `UpdateDocumentStatusRequestDto`
- **Mappers** — conversão `Entity ↔ DTO` para manter o domínio limpo

#### 3. Infrastructure

- **Adapters** — `PrismaDocumentRepository`, `InMemoryDocumentRepository` (testes)
- **HTTP** — rotas Fastify, handler de erros, schemas para validação

---

## 🛠 Stack

| Categoria | Tecnologia |
|-----------|------------|
| **Runtime** | Node.js 20+ |
| **Linguagem** | TypeScript 5.9 |
| **Framework HTTP** | Fastify 5.x |
| **ORM** | Prisma 6.x |
| **Banco de Dados** | PostgreSQL |
| **Validação** | JSON Schema (via Fastify) |
| **Testes** | Vitest 3.x |
| **Contêineres** | Docker / Docker Compose |

---

## ⚡ Quick Start

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm, pnpm ou yarn

### Instalação

```bash
git clone <url-do-repositorio>
cd document-api

npm install
cp .env.example .env
```

### Execução

```bash
# 1. Subir PostgreSQL
docker compose up -d

# 2. Configurar banco
npx prisma generate
npx prisma db push

# 3. Rodar API (desenvolvimento)
npm run dev
```

API disponível em **http://localhost:5050**

---

## 📡 API

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Boas-vindas |
| `GET` | `/health` | Health check |
| `POST` | `/documents` | Criar documento |
| `GET` | `/documents` | Listar documentos |
| `PATCH` | `/documents/:id` | Atualizar status |
| `DELETE` | `/documents/:id` | Remover documento |

### Exemplos

**Criar documento**
```bash
curl -X POST http://localhost:5050/documents \
  -H "Content-Type: application/json" \
  -d '{"title": "Contrato", "description": "Contrato de prestação de serviços"}'
```

**Listar documentos**
```bash
curl http://localhost:5050/documents
```

**Atualizar status**
```bash
curl -X PATCH http://localhost:5050/documents/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "signed"}'
```

**Deletar documento**
```bash
curl -X DELETE http://localhost:5050/documents/{id}
```

### Status do documento

| Valor | Descrição |
|-------|-----------|
| `pending` | Pendente |
| `signed` | Assinado |

### Respostas de erro

| Status | Cenário |
|--------|---------|
| `400` | Validação (ex: title vazio) |
| `404` | Documento não encontrado |
| `500` | Erro interno |

---

## 📁 Estrutura

```
document-api/
├── prisma/
│   └── schema.prisma           # Schema do banco
├── src/
│   ├── domain/                 # Núcleo (sem dependências externas)
│   │   ├── entities/           # DocumentEntity
│   │   ├── errors/             # AppError, ValidationError
│   │   ├── ports/              # DocumentRepositoryPort
│   │   └── use-cases/          # Create, List, Update, Delete
│   ├── application/            # Orquestração
│   │   ├── dtos/               # Request/Response DTOs
│   │   └── mappers/            # Entity ↔ DTO
│   ├── infrastructure/         # Adaptadores
│   │   ├── database/           # Prisma + repositórios
│   │   └── http/               # Rotas Fastify + error handler
│   ├── app.ts                  # Factory da aplicação
│   └── index.ts                # Bootstrap + graceful shutdown
├── tests/
│   ├── unit/                   # Use cases com InMemory
│   └── integration/            # API com Fastify inject
└── docker-compose.yml          # PostgreSQL
```

---

## 🧪 Testes

Estratégia: **testes unitários** nos use cases e **integração** nas rotas HTTP. O repositório em memória permite rodar testes sem banco.

```bash
npm test
```

### Cobertura

- **Unitários** — use cases com `InMemoryDocumentRepository`
- **Integração** — rotas `/documents` (CRUD, validações, 404)

---

## 📜 Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run build` | Build + Prisma generate |
| `npm start` | Produção |
| `npm test` | Executa testes |
| `npm run test:watch` | Testes em modo watch |
| `npx prisma studio` | Interface visual do banco |
| `npx prisma migrate dev` | Criar e aplicar migrations |

---

## 📄 Licença

ISC
