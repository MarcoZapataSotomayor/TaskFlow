# TaskFlow

A full-stack web application designed to manage personal tasks through a simple, intuitive, and responsive interface.

TaskFlow allows users to create, view, update, and delete tasks, with persistent data storage using PostgreSQL.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

### Tools
- Docker & Docker Compose
- pnpm
- Vitest
- Git

## Features

- **Create Tasks:** Add new tasks easily.
- **View Tasks:** Display tasks stored in the database.
- **Update Tasks:** Edit existing task titles.
- **Delete Tasks:** Remove tasks from the database.
- **Data Persistence:** Store tasks in PostgreSQL.
- **Input Validation:** Validate incoming data using NestJS DTOs.
- **Error Handling:** Display helpful messages when requests fail.
- **Loading States:** Provide visual feedback while fetching tasks.
- **Responsive Design:** Support desktop and mobile screens.
- **Unit Testing:** Test backend functionality using Vitest and mocked Prisma services.

## Project Structure

```text
TaskFlow/
├── frontend/        # React application
├── backend/         # NestJS REST API
├── compose.yaml     # PostgreSQL Docker configuration
├── .gitignore
└── README.md
```

## Architecture

TaskFlow follows a client-server architecture.

The **frontend** is built with React and TypeScript. It communicates with the backend through HTTP requests.

The **backend** is built with NestJS and exposes REST API endpoints for managing tasks.

Prisma ORM handles database operations, while PostgreSQL provides persistent storage inside a Docker container.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tareas` | Retrieve all tasks |
| POST | `/tareas` | Create a new task |
| PATCH | `/tareas/:id` | Update an existing task |
| DELETE | `/tareas/:id` | Delete a task |

## Testing

The backend includes unit tests written with Vitest.

Prisma services are mocked to test application logic independently of the database.

The current test suite covers CRUD operations and error handling for nonexistent tasks.

## Project Status

**Version 1.0 — Functional Full-Stack CRUD Application**

This project was developed as part of my hands-on training in full-stack software development, with a focus on building REST APIs, integrating databases, writing automated tests, and developing responsive user interfaces.

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

- Node.js
- pnpm
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd TaskFlow
```

Replace `<repository-url>` with the HTTPS URL of this repository.

### 2. Configure PostgreSQL

Create a `.env` file in the project root using `.env.example` as a template.

Set `POSTGRES_PASSWORD` to a password of your choice.

Start the PostgreSQL container:

```bash
docker compose up -d
```

### 3. Set up the backend

Open a terminal in the `backend` directory:

```bash
cd backend
pnpm install
```

Create a `.env` file using `backend/.env.example` as a template.

Update `DATABASE_URL` with the PostgreSQL credentials configured in the previous step.

Run the database migrations and generate Prisma Client:

```bash
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

Start the API:

```bash
pnpm start:dev
```

The backend runs at `http://localhost:3000`.

### 4. Start the frontend

Open another terminal in the `frontend` directory:

```bash
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:5173` in your browser.

### 5. Run the tests

From the `backend` directory:

```bash
pnpm exec vitest run
```