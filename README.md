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

Create a `.env` file in the project root:

```env
COMPOSE_PROJECT_NAME=fullstack-todo-app

POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database

DATABASE_URL=postgresql://your_username:your_password@postgres:5432/your_database

JWT_SECRET=your_jwt_secret
```

Start the app:

```bash
docker compose up -d --build
```

Stop the app:

```bash
docker compose down
```

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