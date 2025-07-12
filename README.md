
# ReWear – A Community Clothing Exchange Platform

![ReWear Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=400&fit=crop&q=80)

**ReWear** is a full-stack, modern web platform that promotes sustainable fashion through a peer-to-peer clothing exchange system. The platform enables users to swap unused clothes, earn points, and join a conscious fashion community.

---

## 🚀 Live Demo & Deployment Status

**Status:** ✅ MVP Complete  
- **Frontend:** [Live Demo URL]  
- **Backend:** [Live API URL]

---

## ✨ Features

### 🧑 User Features
- **Register/Login with JWT Auth**
- **Create & Manage Listings** (add items, upload images, set size, brand, etc.)
- **Browse Listings**: View all available items
- **Request Swaps**: Request a listed item in exchange for one of yours
- **Swap History**: Track your incoming & outgoing swap status
- **Real-Time Notifications** *(if using Socket.IO)*

### 🛠 Admin Features
- **Admin-only Dashboard**
- **Moderate Listings**: Approve/Reject user uploads
- **Manage Users**: View user details and account roles
- **Track Swaps**: Monitor all active swap requests

---

## 🛠 Tech Stack

### ⚛️ Frontend
- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Prototyping:** [v0.dev](https://v0.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
- **Socket Integration:** [Socket.IO Client](https://socket.io/)

### 🔧 Backend
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Authentication:** [JWT](https://jwt.io/)
- **File Uploads:** [Multer](https://github.com/expressjs/multer)
- **WebSockets:** [Socket.IO](https://socket.io/)

---

## ⚙️ Local Development Setup

### 🔐 Prerequisites
- Node.js (v18+)
- PostgreSQL (Local/Cloud)
- npm or yarn

---

### 📦 Backend Setup

```bash
# Clone the repo
git clone https://github.com/your-username/rewear-project.git
cd rewear-project/server

# Install dependencies
npm install

# Setup environment variables
touch .env
# Add the following to .env
PORT=3001
JWT_SECRET=your_secret_key

# Configure PostgreSQL
# Edit config/config.json under "development"
# {
#   "username": "your_db_username",
#   "password": "your_db_password",
#   "database": "rewear_dev",
#   "host": "127.0.0.1",
#   "dialect": "postgres"
# }

# Run migrations
npx sequelize-cli db:migrate

# Start server
nodemon index.js
````

The backend will be running at `http://localhost:3001`.

---

### 🖼️ Frontend Setup

```bash
# Open a new terminal tab
cd ../client

# Install dependencies
npm install

# Environment setup
touch .env.local
# Add:
NEXT_PUBLIC_API_URL=http://localhost:3001

# Start frontend
npm run dev
```

Now visit: `http://localhost:3000`

---

## 🧪 API Endpoints (Selected)

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| POST   | `/api/auth/register`         | Register user                 |
| POST   | `/api/auth/login`            | Login & return JWT            |
| POST   | `/api/items`                 | Create a new listing          |
| GET    | `/api/items`                 | Get all listings              |
| POST   | `/api/swaps/request/:itemId` | Request a swap                |
| PUT    | `/api/swaps/respond/:swapId` | Accept/Reject swap            |
| GET    | `/api/user/dashboard`        | Get user listings/swaps       |
| GET    | `/api/admin/users`           | Admin: View all users         |
| PUT    | `/api/admin/items/:itemId`   | Admin: Approve/Reject listing |

---

## 👥 Team

| Name                    | Email                                                     |
| ----------------------- | --------------------------------------------------------- |
| Anurag Singh            | [anurag6569201@gmail.com](mailto:anurag6569201@gmail.com) |
| Aditya Kumar Pattanayak | [adityaa320@gmail.com](mailto:adityaa320@gmail.com)       |

---

## 💡 Future Enhancements

* ✅ Image compression for faster uploads
* 🔄 Automated swap suggestion engine (AI-based matching)
* 📱 PWA/mobile support
* 🏆 Gamified rewards system for sustainable actions
* 🌐 Multi-language support

---

## 📄 License

MIT License. Open to contributions and forks.
