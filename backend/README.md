# Backend

Express + MongoDB (Mongoose) API skeleton with JWT auth. Files are organized as:

```
backend/
├─ server.js
├─ .env
├─ package.json
├─ config/
│  └─ db.js
├─ models/
│  └─ User.js
├─ routes/
│  └─ authRoutes.js
├─ controllers/
│  └─ authController.js
└─ middleware/
   └─ authMiddleware.js
```

## Setup

1. Create `.env` (already scaffolded):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=change-me-in-prod
```

2. Install packages (already installed if `node_modules` exists):
- runtime: express, mongoose, dotenv, bcryptjs, jsonwebtoken, cors, morgan
- dev: nodemon

## Run

- Development (auto-restart):
```
npm run dev
```
- Production:
```
npm start
```

Health check:
- GET http://localhost:5000/health → `{ "status": "ok", "time": "..." }`

## Auth routes
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` with `Authorization: Bearer <token>`

## Notes
- If `MONGO_URI` is not set or database is down, the server still starts so `/health` works. Auth endpoints need MongoDB.
- Change `JWT_SECRET` for any real deployment.
