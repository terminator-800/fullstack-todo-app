# Full Stack Todo App

A Dockerized full-stack Todo application built with a React frontend, Node.js backend, and PostgreSQL database.

## About This Project

This is a learning project built to get hands-on experience with:

- **Docker & Docker Compose** — containerizing a multi-service app (client, server, database) with volumes, networks, and healthchecks
- **PostgreSQL** — running a relational database in a container with persistent storage
- **Prisma** — schema modeling, migrations, and type-safe database access
- **Zustand** — lightweight state management on the frontend
- **Zod** — runtime schema validation for forms and API data

## Prerequisites

* Docker Desktop
* Docker Compose

Verify your installation:

```bash
docker --version
docker compose version
```

## Clone the Repository

```bash
git clone https://github.com/terminator-800/fullstack-todo-app.git
cd fullstack-todo-app
```

## Environment Configuration

Create a `.env` (or `.env.development`) file in the project root:

```env
COMPOSE_PROJECT_NAME=fullstack-todo-app
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
DATABASE_URL=postgresql://your_username:your_password@postgres:5432/your_database
JWT_SECRET=your_jwt_secret
PORT=5000
BREVO_API_KEY=your_brevo_api_key
NODE_ENV=development
SUPERADMIN_NAME=Super Admin
SUPERADMIN_EMAIL=your_email@example.com
SUPERADMIN_PASSWORD=your_strong_password
```

**If using `.env`** (default, no extra flag needed):

```bash
docker compose up -d --build
```

**If using `.env.development`** (or any other custom name), pass it explicitly with `--env-file`:

```bash
docker compose --env-file .env.development up -d --build
```

Once running, the app is available at:

- Client: http://localhost:5173
- Server API: http://localhost:5000

## First-Time Setup: Run Database Migrations

The first time you start the app, the database will be empty — no tables exist yet. Run this once to create them:

```bash
docker compose --env-file .env.development exec server npx prisma migrate dev --name init
```

Stop the app:

```bash
docker compose down
```
(add `--env-file .env.development` if that's the file you're using)

Remove containers and volumes too:

```bash
docker compose down -v
```

## Useful Commands

View running containers:

```bash
docker ps
```

View logs:

```bash
docker compose logs
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

List Docker volumes:

```bash
docker volume ls
```

List Docker networks:

```bash
docker network ls
```

## Database Migrations

Whenever you change `server/prisma/schema.prisma` (adding/removing models, fields, or constraints), you need to run a migration to apply those changes to the database.

Create and apply a new migration:

```bash
docker compose --env-file .env.development exec server npx prisma migrate dev --name describe_your_change
```

Replace `describe_your_change` with a short description of what changed (e.g. `add_due_date_to_todo`).

You do **not** need to run this for normal app development — only when the schema itself changes.

## Seed the Superadmin Account

After running migrations for the first time, seed the superadmin account:

​```bash
docker compose --env-file .env.development exec server npm run seed:superadmin
​```

This creates a superadmin user using the `SUPERADMIN_NAME`, `SUPERADMIN_EMAIL`, and `SUPERADMIN_PASSWORD` values from your `.env` file. Running this command again is safe — it checks if a superadmin already exists and skips creation if so.

Make sure your `.env` (or `.env.development`) includes these three variables before running the seed command:

​```env
SUPERADMIN_NAME=Super Admin
SUPERADMIN_EMAIL=your_email@example.com
SUPERADMIN_PASSWORD=your_strong_password
​```