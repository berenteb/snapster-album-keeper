# Snapster Album Keeper

Fotó és albumkezelő webalkalmazás.

## Fejlesztői környezet

- NodeJS 20.x vagy újabb
- npm 10.x vagy újabb

## Telepítés

1. Függőségek
```bash
npm install
```

2. Környezeti változók beállítása
```bash
cd apps/frontend
cp .env.example .env
```

```bash
cd apps/backend
cp .env.example .env
```

## Docker konténerek indítása (adatbázis és tárhely)
```bash
docker compose -f apps/infra/dev/docker-compose.dev.yml up -d
```

## Fejlesztői környezet indítása
```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

## Build készítése saját felhasználásra
```bash
npm run build:backend
```

```bash
npm run build:frontend
```

## Docker konténerek indítása production módban
```bash
cp apps/infra/prod/.env.prod.backend.example apps/infra/prod/.env.prod.backend
```

```bash
docker compose -f apps/infra/prod/docker-compose.prod.yml up -d
```
## Technológiák

- ViteJS
- React
- TypeScript
- Tailwind CSS
- NestJS
- Postgres
- MinIO

## Licensz

MIT License 