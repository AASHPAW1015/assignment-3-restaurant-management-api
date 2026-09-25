# Restaurant Management API

Assignment 3 — Ashutosh Pawar (150096725130)

A restaurant management REST API built with Express and MongoDB, with JWT authentication
on all write routes. Restaurants own menu items through a foreign key. A simple HTML
frontend in `frontend/` uses the API.

## Live demo

- Frontend (Vercel): https://restaurant-webapp-omega.vercel.app
- API (Render): https://assignment-3-restaurant-management-api-j0s9.onrender.com

The API runs on Render's free tier, so the first request after a period of inactivity
can take up to a minute while the server wakes up.

## Tech stack

- Express 5
- MongoDB via Mongoose
- jsonwebtoken for auth tokens
- bcryptjs for password hashing
- dotenv for config
- cors so the frontend can call the API from another domain
- Frontend: plain HTML + JavaScript, SweetAlert2 for alerts (no build step)

## Project structure

```
Ashutosh_Pawar_150096725130/
├── config/
│   └── db.js                     # mongoose connection
├── models/
│   ├── Users.js                  # user schema
│   ├── Restaurants.js            # restaurant schema
│   └── MenuItems.js              # menu item schema, restaurantId foreign key
├── controllers/
│   ├── authController.js         # register, login
│   ├── restaurantController.js   # restaurant CRUD + top rated
│   └── menuController.js         # menu item CRUD
├── routes/
│   ├── authRoutes.js             # /register, /login
│   ├── restaurantRoutes.js       # /restaurants
│   └── menuRoutes.js             # /menu
├── middleware/
│   ├── auth.js                   # Bearer token check
│   └── logger.js                 # request logger
├── frontend/
│   ├── config.js                 # API URL + shared fetch helper
│   ├── index.html                # home: register / login
│   ├── register.html
│   ├── login.html                # stores the JWT in localStorage
│   ├── restaurants.html          # list, top 5, delete
│   ├── restaurant-form.html      # add / edit a restaurant
│   └── menu.html                 # a restaurant's menu items
├── api.http                      # sample requests
├── .env.example                  # environment template
└── server.js                     # app entry, port 3000
```

## Setup

Requires Node.js and a local MongoDB running on `mongodb://localhost:27017`
(database `itm_restaurant_api`, created automatically).

```bash
npm install
cp .env.example .env
npm start          # or: npm run dev
```

Server runs at `http://localhost:3000`.

**Frontend:** open `frontend/index.html` in the browser, or serve the folder
(e.g. `npx serve frontend`). When opened locally it talks to `http://localhost:3000`,
otherwise to the Render URL set in `frontend/config.js`.

### Environment variables

| Variable | Notes |
|---|---|
| `PORT` | port the server listens on, defaults to `3000` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | secret used to sign tokens |
| `JWT_EXPIRES_IN` | token lifetime, e.g. `1h` |

## Deployment

- **API** on Render: root directory `Ashutosh_Pawar_150096725130`, build `npm install`,
  start `npm start`. Set `MONGO_URI` (MongoDB Atlas), `JWT_SECRET` and `JWT_EXPIRES_IN`.
  Render provides `PORT`.
- **Frontend** on Vercel: the `frontend/` folder deployed as static files.

## Data models

**User**

| Field | Type | Notes |
|---|---|---|
| `username` | String | required, unique |
| `email` | String | required, unique |
| `password` | String | required, bcrypt hashed |

**Restaurant**

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `city` | String | required |
| `address` | String | required |
| `cuisine` | String | required |
| `rating` | Number | required, 0 to 5 |

**MenuItem**

| Field | Type | Notes |
|---|---|---|
| `restaurantId` | ObjectId | required, foreign key referencing `Restaurants` |
| `name` | String | required |
| `price` | Number | required, cannot be negative |
| `isAvailable` | Boolean | defaults to `true` |

Both schemas use `{ timestamps: true }`. Deleting a restaurant also deletes its menu items.

## Authentication

Register, then log in to get a token. Send it on protected routes as:

```
Authorization: Bearer <token>
```

A missing, invalid or expired token returns `401`.

## Endpoints

**Auth**

| Method | Route | Token | Description |
|---|---|---|---|
| POST | `/register` | no | create an account |
| POST | `/login` | no | log in, returns a JWT |

**Restaurants**

| Method | Route | Token | Description |
|---|---|---|---|
| GET | `/restaurants` | no | list all restaurants |
| GET | `/restaurants/top` | no | top 5 restaurants by rating |
| GET | `/restaurants/:id` | no | get one restaurant |
| POST | `/restaurants` | yes | create a restaurant |
| PUT | `/restaurants/:id` | yes | update a restaurant |
| DELETE | `/restaurants/:id` | yes | delete a restaurant and its menu items |

**Menu**

| Method | Route | Token | Description |
|---|---|---|---|
| GET | `/restaurants/:id/menu` | no | list a restaurant's menu items |
| POST | `/restaurants/:id/menu` | yes | add a menu item to a restaurant |
| PUT | `/menu/:id` | yes | update a menu item |
| DELETE | `/menu/:id` | yes | delete a menu item |

`/restaurants/top` is declared before `/restaurants/:id`, otherwise `top` gets read as an id.

## Status codes

| Code | When |
|---|---|
| 200 | successful read, update or delete |
| 201 | resource created |
| 400 | missing or invalid field, or a malformed id |
| 401 | bad credentials, or a missing/invalid/expired token |
| 404 | resource not found, or unknown route |
| 500 | server error |

## Testing the API

`api.http` has ready-made requests for every endpoint above. It runs in any HTTP client
editor plugin (kulala.nvim, REST Client, IntelliJ HTTP client).

Every request is logged to the console as `[timestamp] METHOD /path` by `middleware/logger.js`.
