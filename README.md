# Product Catalog Frontend

The frontend for a multi-role product catalog and commerce application. Customers can browse products, manage a cart, place orders, and chat with sellers. Sellers can manage products and orders, while administrators can manage the catalog, users, sellers, orders, activity, and audits.

## Features

### Customer experience

- Landing page and product exploration
- Product details
- Shopping cart
- Customer profile
- Order creation and order history
- Payment success and cancellation pages
- Real-time chat
- Light and dark themes

### Seller experience

- Seller dashboard
- Product listing, creation, and editing
- Seller order management
- Seller profile
- Activity view
- Customer chat

### Admin experience

- Dashboard and analytics
- Product catalog management
- Order fulfillment and order details
- Seller and customer management
- Admin profile
- Activity and audit views
- Chat

## Prerequisites

Install the following before setting up the project:

- Node.js 18 or newer
- npm 9 or newer
- Access to the application backend API
- A running backend when using API-backed features

Check your installed versions:

```bash
node --version
npm --version
```

The backend is not included in this repository. Ensure it is running and that its API and Socket.IO endpoints are accessible from the frontend origin.

## Installation

Clone the repository and move into the frontend directory:

```bash
git clone <repository-url>
cd frontend
```

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite prints the local development URL in the terminal, usually `http://localhost:5173`.

## Configuration

Create a `.env` file in the project root. Vite only exposes variables prefixed with `VITE_` to browser code.

```env
VITE_BACKEND_URL=http://localhost:5000
```

`VITE_BACKEND_URL` is used by the API client and Socket.IO client. Set it to the URL where the backend is running. The API client falls back to `/api` when this variable is omitted, which is useful when a reverse proxy serves the backend under the same origin. Configure the full backend URL for local development when the frontend and backend run on different ports.

Example:

```env
# Local backend
VITE_BACKEND_URL=http://localhost:5000
```

Do not commit `.env` files or credentials. Create separate environment files for local, staging, and production deployments as needed.

## Available Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reload |
| `npm run build`   | Create an optimized production build in `dist/`   |
| `npm run preview` | Serve the production build locally                |
| `npm run lint`    | Run ESLint across the project                     |

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Project Structure

```text
frontend/
├── public/                 # Public files served as-is
├── src/
│   ├── app/
│   │   ├── initializer/    # Application startup and initialization
│   │   ├── router/         # Route definitions and protected routes
│   │   ├── store/          # Redux store, cart, and user state
│   │   └── theme/          # Theme context, provider, and hooks
│   ├── assets/             # Images and bundled static assets
│   ├── features/
│   │   ├── admin/          # Admin pages, layouts, components, and APIs
│   │   ├── auth/           # Login, registration, and verification
│   │   ├── cart/           # Cart pages, hooks, and API services
│   │   ├── chat/           # Chat pages, hooks, components, and APIs
│   │   ├── orders/         # Customer order flows and order APIs
│   │   ├── seller/         # Seller dashboard and product management
│   │   └── shop/           # Public catalog and shopping pages
│   └── shared/
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Shared React hooks
│       └── utils/          # API, auth, date, currency, and socket utilities
├── .env                    # Local environment variables (not committed)
├── package.json            # Scripts and dependencies
├── vite.config.js          # Vite, React, Babel, and Tailwind configuration
├── eslint.config.js        # ESLint configuration
└── vercel.json             # SPA rewrite configuration for Vercel
```

## Application Architecture

- **React and Vite** provide the component-based UI and development tooling.
- **React Router** handles public and role-protected routes.
- **Redux Toolkit** stores application state such as the cart and current user.
- **TanStack React Query** manages server state and data fetching.
- **Axios** handles HTTP requests to the backend.
- **Socket.IO Client** provides real-time chat communication.
- **Ant Design and Tailwind CSS** provide UI components and styling.
- **React Compiler** is enabled through the Vite Babel configuration.

Routes are grouped by access level:

- Public routes: `/`, `/shop`, `/shop/:id`, `/cart`, and `/auth/*`
- Customer routes: `/orders/*`, `/payment/*`, and `/profile`
- Seller routes: `/seller/*`
- Admin routes: `/admin/*`
- Shared authenticated chat routes: `/chat` and `/chat/:id`

Role-protected routes require the corresponding authenticated backend user role. The backend must provide valid authentication and authorization responses for these flows.

## Production Build and Deployment

Create the production bundle:

```bash
npm run build
```

The generated files are written to `dist/`. To test the production bundle locally:

```bash
npm run preview
```

For deployment, configure `VITE_BACKEND_URL` in the hosting provider's environment settings before building. The included `vercel.json` rewrites requests to `index.html`, allowing client-side React Router routes to work on Vercel.

The deployed frontend must be able to reach the backend over the network, and the backend must allow the deployed frontend origin through its CORS and Socket.IO configuration.
