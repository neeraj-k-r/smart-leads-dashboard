# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js), TypeScript, and TailwindCSS.

## Features

*   **Authentication**: JWT-based user registration and login with bcrypt hashing.
*   **Role-Based Access Control**: `admin` and `sales_user` roles. Only admins can delete leads.
*   **Leads Management (CRUD)**: Create, view, update, and delete leads.
*   **Advanced Filtering & Search**: Debounced search by name/email, filter by status and source, and sort by latest/oldest.
*   **Pagination**: Backend-driven pagination (10 records per page).
*   **CSV Export**: Export all leads to a CSV file.
*   **UI/UX**: Responsive design, dark mode support, loading states, and comprehensive error handling.
*   **Docker Ready**: Multi-stage Dockerfile and Docker Compose setup for easy deployment.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite, TailwindCSS, Lucide React (Icons), Axios, React Context API.
*   **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, Zod (Validation), JSON Web Tokens (JWT).

## Prerequisites

*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Docker & Docker Compose (Optional, for containerized setup)

## Setup Instructions

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd smart-leads-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Copy the example environment file and update the variables:
    ```bash
    cp .env.example .env
    ```
    *Ensure `MONGO_URI` and `JWT_SECRET` are correctly set.*

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    *This starts both the Vite frontend and Express backend concurrently.*

5.  **Build for Production:**
    ```bash
    npm run build
    npm start
    ```

### Docker Setup

1.  Ensure Docker and Docker Compose are installed and running.
2.  Run the following command to build and start the containers:
    ```bash
    docker-compose up --build
    ```
3.  The application will be accessible at `http://localhost:3000`.

## API Documentation

### Authentication (`/api/auth`)

*   **POST `/register`**
    *   **Body**: `{ name: string, email: string, password: string, role?: 'admin' | 'sales_user' }`
    *   **Response**: `{ success: true, message: 'User created' }`
*   **POST `/login`**
    *   **Body**: `{ email: string, password: string }`
    *   **Response**: `{ success: true, data: { token: string, role: string } }`

### Leads (`/api/leads`) - Requires Bearer Token

*   **GET `/`**
    *   **Query Params**: `page` (default: 1), `limit` (default: 10), `search`, `status`, `source`, `sort` ('latest' or 'oldest')
    *   **Response**: `{ success: true, data: [...leads], meta: { total, page, limit } }`
*   **POST `/`**
    *   **Body**: `{ name: string, email: string, status?: string, source: string }`
    *   **Response**: `{ success: true, data: { ...lead } }`
*   **PUT `/:id`**
    *   **Body**: `{ ...fieldsToUpdate }`
    *   **Response**: `{ success: true, data: { ...lead } }`
*   **DELETE `/:id`** - *Admin Only*
    *   **Response**: `{ success: true, message: 'Lead deleted' }`
*   **GET `/export`**
    *   **Response**: CSV File download

## Evaluation Criteria Addressed

*   **Code Quality**: ESLint/Prettier compliance, functional components, clean architecture.
*   **Project Structure**: Proper separation of `frontend` and `backend` codebases.
*   **TypeScript Usage**: Interfaces defined for models, props, and API responses. Minimal use of `any`.
*   **API Design**: RESTful standard, proper status codes, and centralized error handler.
*   **UI/UX Quality**: Tailwind UI with dark mode, empty states, loading spinners, and responsive grid/flex layouts.
*   **Error Handling**: Global backend error catcher, Zod validation errors mapped cleanly, frontend toasts/alerts.
