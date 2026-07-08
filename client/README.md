# Todo App Client

A modern frontend for a full-stack Todo application built with **React**, **TypeScript**, and **Vite**. This project focuses on creating a clean, responsive user interface with authentication, form validation, and state management while consuming a REST API from the backend.

## 🚀 Tech Stack

* **React.js** – UI Library
* **TypeScript** – Static typing
* **Vite** – Fast development server and build tool
* **Tailwind CSS** – Utility-first CSS framework
* **Zustand** – Lightweight state management
* **Zod** – Schema validation
* **React Router DOM** – Client-side routing
* **Axios** – HTTP client for API requests
* **ESLint** – Code linting and best practices

## 📂 Project Structure

```text
src/
├── api/            # Axios configuration and API services
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Application pages
├── routes/         # Route configuration
├── schemas/        # Zod validation schemas
├── store/          # Zustand stores
├── types/          # TypeScript interfaces and types
├── utils/          # Utility functions
├── App.tsx
└── main.tsx
```

## ✨ Features

* User Authentication
* Protected Routes
* Todo CRUD Operations
* Client-side Form Validation
* Global State Management
* Responsive UI
* REST API Integration
* Type-safe Development

## 🛠️ Getting Started

### Clone the repository

```bash
git clone <repository-url>
```

### Navigate to the project

```bash
cd client
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

## 📜 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 📌 Planned Features

* User Registration
* User Login
* JWT Authentication
* Create Todo
* View Todos
* Update Todo
* Delete Todo
* Mark Todo as Complete
* Search Todos
* Filter Todos
* Persistent Authentication
* Loading & Error States

## 🔗 Backend

This frontend communicates with a REST API built using:

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM

## 📄 License

This project is intended for learning and educational purposes.
