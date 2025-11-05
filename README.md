# SlotSwapper

A full-stack web application for swapping time slots/events between users. Built with React, Vite, Express, MongoDB, and Tailwind CSS.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Event Management**: Create, view, update, and delete personal events
- **Slot Swapping**: Mark events as swappable and request swaps with other users
- **Marketplace**: Browse available swappable slots from other users
- **Requests Management**: View and respond to incoming swap requests, track outgoing requests
- **Responsive Design**: Modern UI with Tailwind CSS and Lucide icons

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS v4
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/slotswapper.git
   cd slotswapper
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the `backend` directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/slotswapper
   JWT_SECRET=your_jwt_secret_here
   ```

   For production, use a cloud MongoDB URI.

## Running the Application

### Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5174

### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `dist` folder with the built files.

2. Start the backend:
   ```bash
   cd backend
   npm start
   ```

## Deployment

### Frontend Deployment
The frontend can be deployed to static hosting services like Netlify, Vercel, or GitHub Pages.

1. Build the frontend: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure the API base URL in `frontend/src/api/api.js` to point to your deployed backend

### Backend Deployment
The backend can be deployed to cloud platforms like Heroku, Railway, or Vercel.

1. Ensure your `package.json` has a `start` script
2. Set environment variables in your deployment platform
3. For MongoDB, use a cloud database like MongoDB Atlas

### Full-Stack Deployment
For a unified deployment, you can use Vercel with the backend as serverless functions, or deploy both to the same platform.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create a new event
- `PATCH /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Swaps
- `GET /api/swappable-slots` - Get all swappable slots
- `POST /api/swap-request` - Request a swap
- `POST /api/swap-response/:id` - Respond to a swap request
- `GET /api/swap-requests` - Get user's swap requests

## Usage

1. Register a new account or login
2. Create events in your Dashboard
3. Mark events as "Swappable" to make them available for trading
4. Visit the Marketplace to browse and request swaps
5. Check the Requests page to manage incoming and outgoing swap requests
6. Accept or reject swap requests as needed

## Project Structure

```
slotswapper/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   └── ...
│   ├── public/
│   └── package.json
├── README.md
└── .gitignore
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Screenshots

(Add screenshots of your app here)

## Demo

[Live Demo Link](https://your-demo-link.com)