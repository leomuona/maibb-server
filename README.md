# maibb-server

MaiBB server

- Node
- Typescript
- Fastify
- Swagger
- Knex
- MariaDB

## Commands

First make your .env and make changes according to your local setup:

```
cp .env.example .env
```

For local development, use this:

```
npm run dev
```

Below are some other commands.

Check linting rules:

```
npm run lint
```

Format files with linting rules:

```
npm run format --write
```

Compile and start separately:

```
npm run build
npm start
```

Run MariaDB in a container:

```
docker run --name maibb-mariadb --restart unless-stopped -e MYSQL_ROOT_PASSWORD=changeme -p 3306:3306 -d mariadb
```
