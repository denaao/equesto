# Equesto — Contexto do Projeto para Agentes

## O que é

Equesto é um diretório inteligente para o mercado de turfe brasileiro. Conecta usuários a profissionais e empresas do setor via WhatsApp. Não há chat interno, pagamentos ou avaliações — o contato acontece fora do app.

**Fluxo principal:** Abrir → Buscar → Escolher → Contatar via WhatsApp

## Stack

| Camada   | Tecnologia                                              |
|----------|---------------------------------------------------------|
| Mobile   | React Native 0.81.5 + Expo ~54.0.0                      |
| Backend  | Node.js + Express 4 + PostgreSQL (pg)                   |
| Auth     | JWT (jsonwebtoken) + bcryptjs — apenas para admin       |
| Admin    | React + Vite                                            |
| Deploy   | Railway (backend + banco)                               |
| Uploads  | multer (instalado, endpoint ainda não implementado)     |

## Estrutura de pastas

```
backend/
  src/
    index.js          — entry point, middlewares, rotas
    database.js       — Pool PostgreSQL via DATABASE_URL
    middleware/auth.js — validação JWT
    routes/
      auth.js         — POST /api/auth/login, GET /api/auth/me
      categories.js   — CRUD de categorias
      listings.js     — CRUD de anúncios (público + admin)
    migrate.js        — runner de migrations
    seed/             — scripts de seed (create_admin.js)
  migrations/
    001_initial.sql   — schema completo + categorias seed

mobile/
  src/
    services/api.js   — todas as chamadas HTTP
    screens/          — 7 telas
    navigation/       — React Navigation (Stack + BottomTab)
    theme/            — cores e estilos globais

admin/
  src/
    pages/            — Dashboard, Login, Listings, ListingForm, Categories
    services/         — chamadas à API admin
```

## Banco de dados

Três tabelas: `categories`, `listings`, `admin_users`.

- `listings` tem full-text search em português via GIN index (`to_tsvector`)
- `updated_at` é atualizado automaticamente via trigger
- `approved = FALSE` por padrão — admin precisa aprovar cada anúncio
- `featured = TRUE` prioriza na ordenação da home

## Autenticação

Só admins se autenticam. Usuários do app são anônimos. JWT com expiração de 7 dias. Sem refresh token. Sem blacklist de tokens.

## Restrições do MVP (não implementar sem decisão explícita)

- Sem chat interno
- Sem pagamentos
- Sem avaliações / reviews
- Sem cadastro de usuários
- Sem notificações push
- Sem painel multi-tenant

## Ambiente local

- Backend roda em `localhost:3000`
- Admin roda em `localhost:5173`
- Mobile usa IP local hardcoded em `mobile/src/services/api.js` — intencional durante desenvolvimento
- `DATABASE_URL` e `JWT_SECRET` via `.env` (não commitado)

## Pendências conhecidas

- Rota de upload de imagens não implementada (multer instalado)
- Sem rate limiting no endpoint de login
- `MessagesScreen.js` está na navegação mas fora do escopo do MVP — placeholder
- CORS com URLs hardcoded — revisar antes do deploy

## Convenções

- IDs são UUIDs (uuid-ossp)
- Datas em TIMESTAMPTZ
- Respostas de erro: `{ error: "mensagem" }`
- Respostas paginadas: `{ data: [], total: N, page: N, limit: N }`
- Queries parametrizadas com `$1, $2...` (pg)
- Cores: verde escuro `#1B4332` (primary), dourado `#C9A227` (accent)
