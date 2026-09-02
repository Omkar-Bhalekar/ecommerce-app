# ShopSphere – Full Stack E-Commerce Platform

**Everything You Love, All in One Place**

A complete React + Node.js + **MySQL** shopping application for local development and college project demos.

Architecture: React (Vite) → REST APIs (Axios) → Express (MVC) → **mysql2** → **MySQL** (`ecommerce_db`). MongoDB is not used.

## 1. Prerequisites

- Node.js 18+
- MySQL Server 8.x and MySQL Workbench (or any MySQL client)

## 2. MySQL database setup

1. Start MySQL.
2. Open MySQL Workbench and connect as a user that can create databases (usually `root`).
3. Run the full script:

`database/ecommerce.sql`

This creates `ecommerce_db`, all tables with foreign keys, indexes, sample categories, 24 products, variants, images, a demo address, and reviews.

You can also run from a terminal:

```bash
mysql -u root -p < database/ecommerce.sql
```

On Windows PowerShell, if `mysql` is on your PATH:

```powershell
Get-Content database\ecommerce.sql | mysql -u root -p
```

## 3. Environment variables

### Backend — `server/.env`

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Copy from `server/.env.example` if needed. Set `DB_PASSWORD` to your real MySQL password.

### Frontend — `client/.env`

```
VITE_API_URL=http://localhost:5000/api
```

Change this if the API runs on another host or port.

## 4. Backend installation

```bash
cd server
npm install
npm run dev
```

The API starts at `http://localhost:5000`. On boot it hashes demo user passwords with bcrypt.

Health check: `GET http://localhost:5000/api/health`

## 5. Frontend installation

```bash
cd client
npm install
npm run dev
```

The app starts at `http://localhost:5173`.

## 6. Commands to run the project

Terminal 1 (MySQL must already be running):

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

### Demo login

- Email: `alex@shopsphere.com`
- Password: `Password123!`

Register a new account from the UI if you prefer.

## Features

- JWT auth (register, login, protected routes, logout)
- Product browse, search, category/price/rating/brand/size/color filters, sort, pagination
- Product details with size/color, reviews, related products
- Cart (qty, remove, subtotal, shipping, tax, total)
- Wishlist
- Addresses (CRUD + default)
- Checkout → simulated payment (Card / UPI / Net Banking / Wallet) → MySQL transactional order
- Order history
- Personal shopping bookings
- Contact form + floating live chat (stores messages in MySQL)

## API overview

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/products` | No |
| GET | `/api/products/:id` | No |
| GET | `/api/products/search?query=` | No |
| GET | `/api/products/category/:categoryId` | No |
| GET/POST/PUT/DELETE | `/api/cart` | Yes |
| GET/POST/DELETE | `/api/wishlist` | Yes |
| GET/POST | `/api/orders` | Yes |
| GET/POST/PUT/DELETE | `/api/addresses` | Yes |
| POST | `/api/payments/simulate` | Yes |

Orders are created inside a MySQL transaction: stock checks, order + items, stock decrement, payment row (`SUCCESS`), cart clear.

## Project structure

```
ecommerce-app/
  client/     React + Vite + Tailwind
  server/     Express MVC + mysql2
  database/   ecommerce.sql
```
