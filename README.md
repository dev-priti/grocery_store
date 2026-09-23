# Krishna Grocery Store

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap" />
</p>

Krishna Grocery Store is a responsive grocery e-commerce web app built with React, TypeScript, Vite, and Bootstrap. It includes product browsing, cart management, checkout flow, profile handling, and order tracking with a polished storefront experience.

## Live Demo

- GitHub Pages: https://dev-priti.github.io/grocery_store

## Features

- Product catalog with category browsing
- Search and filtering for grocery items
- Add-to-cart interaction with popup confirmation
- Cart quantity updates and item removal
- Address management for shipping and billing
- Checkout and order confirmation flow
- User registration and login
- Profile page and order history tracking
- Responsive design using Bootstrap with custom styling
- Default product image fallback for broken or missing images

## Tech Stack

- React 19
- TypeScript
- Vite
- Bootstrap 5
- React Router DOM
- Node.js backend

## Project Structure

```bash
.
├── src/
│   ├── components/
│   ├── pages/
│   ├── reducers/
│   ├── types/
│   ├── util/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── middleware/
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm

## Installation

```bash
npm install
```

## Run Locally

Start the frontend:

```bash
npm run dev
```

Start the backend:

```bash
cd backend
npm install
node server.js
```

## Production Build

```bash
npm run build
```

## Deployment

This project is configured for GitHub Pages deployment with `gh-pages`.

```bash
npm run deploy
```

Make sure the GitHub Pages settings in the repository are configured to the correct branch or deployment source.

## Environment Notes

- The frontend connects to the configured backend API endpoint.
- The app uses a relative base path for safer deployment compatibility.
- Static assets are optimized for production builds through Vite.

## Screenshots

Add screenshots here as the project evolves:

```md
![Homepage](./public/screenshots/homepage.png)
![Cart](./public/screenshots/cart.png)
![Checkout](./public/screenshots/checkout.png)
```

## License

This project is intended for educational and demonstration purposes unless otherwise specified by the repository owner.

## Author

Krishna Grocery Store
