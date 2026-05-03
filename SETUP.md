# 🐎 Equesto — Guia de Setup e Deploy

## Estrutura do projeto

```
equesto/
├── backend/     → API Node.js + Express (Railway)
├── mobile/      → App React Native (Expo)
└── admin/       → Painel Admin React (Vite)
```

---

## 1. Backend (Railway)

### Rodar localmente

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com sua DATABASE_URL (PostgreSQL local ou Railway)
npm run migrate        # cria as tabelas
npm run create-admin   # cria o usuário admin padrão
npm run dev            # inicia em modo desenvolvimento
```

A API ficará em: `http://localhost:3000`

### Deploy no Railway

1. Acesse [railway.app](https://railway.app) e crie uma conta
2. Crie um novo projeto → **Deploy from GitHub repo** ou **Empty project**
3. Adicione um banco **PostgreSQL** ao projeto (botão "+ New" → Database → PostgreSQL)
4. Railway preencherá a `DATABASE_URL` automaticamente
5. Configure as variáveis de ambiente no Railway (ver seção abaixo)
6. Faça deploy do código da pasta `backend/`
7. O `railway.toml` garante que as migrations rodam automaticamente antes do start
8. Após o deploy, acesse `https://sua-url.up.railway.app/health` para confirmar

### Variáveis de ambiente obrigatórias no Railway

| Variável | Valor | Como obter |
|---|---|---|
| `DATABASE_URL` | Preenchida automaticamente pelo Railway | — |
| `JWT_SECRET` | Chave aleatória forte (64+ chars) | [randomkeygen.com](https://randomkeygen.com) |
| `CLOUDINARY_URL` | `cloudinary://KEY:SECRET@CLOUD` | [cloudinary.com](https://cloudinary.com) → Dashboard |
| `ADMIN_URL` | URL do painel admin em produção | Após deploy do admin |
| `NODE_ENV` | `production` | — |

### Criar o admin após deploy

```bash
cd backend
ADMIN_EMAIL=seu@email.com ADMIN_PASSWORD=SuaSenhaForte node src/seed/create_admin.js
```

⚠️ **Use uma senha forte. O fallback padrão é público.**

---

## 2. App Mobile (Expo)

### Pré-requisitos

- Node.js 18+
- `npm install -g expo-cli` (ou use `npx expo`)
- Expo Go instalado no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Rodar localmente

```bash
cd mobile
npm install
# Edite src/services/api.js → BASE_URL para http://SEU_IP_LOCAL:3000
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular.

### Atualizar a URL da API para produção

Edite o arquivo `mobile/src/services/api.js`:

```js
const BASE_URL = 'https://equesto-api.up.railway.app'; // sua URL do Railway
```

### Publicar nas lojas (futuro)

```bash
npx expo build:android   # APK / AAB para Google Play
npx expo build:ios       # IPA para App Store
```

---

## 3. Painel Admin (Vite)

### Rodar localmente

```bash
cd admin
npm install
cp .env.example .env
# Edite .env: VITE_API_URL=http://localhost:3000
npm run dev
```

Acesse: `http://localhost:5173`

Login padrão após rodar `create-admin`:
- Email: `admin@equesto.com.br`
- Senha: `Equesto@2024!`

⚠️ **Troque a senha imediatamente após o primeiro acesso.**

### Deploy do Admin

Opções recomendadas (gratuitas):
- **Vercel**: `vercel --prod` (na pasta `admin/`)
- **Netlify**: arraste a pasta `admin/dist` após `npm run build`

Configure a variável `VITE_API_URL` com a URL da sua API no Railway.

---

## 4. Checklist de deploy (primeira vez)

```
[ ] 1. Backend deployado no Railway
[ ] 2. PostgreSQL adicionado ao projeto Railway
[ ] 3. JWT_SECRET setado (chave forte, não o placeholder)
[ ] 4. CLOUDINARY_URL setada (conta gratuita criada em cloudinary.com)
[ ] 5. GET /health retorna {"status":"ok"}
[ ] 6. npm run create-admin rodado com senha forte
[ ] 7. Admin deployado (Vercel ou Netlify)
[ ] 8. ADMIN_URL setada no Railway com a URL real do admin
[ ] 9. mobile/src/services/api.js atualizado com URL do Railway
[ ] 10. Login no admin testado com as novas credenciais
[ ] 11. Criação de um