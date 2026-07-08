# Full Stack Todo App

A Dockerized full-stack Todo application built with a React frontend, Node.js backend, and PostgreSQL database.

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
git clone <repository-url>
cd fullstack-todo-app
```

## Environment Configuration

This project uses separate environment files for different environments.

### Development

Create or update `.env.development`:

```env
COMPOSE_PROJECT_NAME=fullstack-todo-app

POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
```

Start the development environment:

```bash
docker compose --env-file .env.development up -d
```

Stop the development environment:

```bash
docker compose --env-file .env.development down
```

To remove containers and volumes:

```bash
docker compose --env-file .env.development down -v
```

### Production

Create or update `.env.production` with your production values:

```env
COMPOSE_PROJECT_NAME=fullstack-todo-app

POSTGRES_USER=your_production_username
POSTGRES_PASSWORD=your_secure_production_password
POSTGRES_DB=your_production_database
```

Start the production environment:

```bash
docker compose --env-file .env.production up -d
```

Stop the production environment:

```bash
docker compose --env-file .env.production down
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
