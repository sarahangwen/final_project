# KGL Management System

A full-stack web application for managing agricultural products, sales, credits, and user accounts across multiple branches (Maganjo and Matugga).

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [API Routes](#api-routes)
- [Database Models](#database-models)

## 🎯 Project Overview

KGL Management System is designed to:
- Manage agricultural product procurement and inventory
- Track sales transactions
- Handle credit management and records
- Manage user roles (Director, Manager, Sales Agent)
- Support multiple branch operations

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Pug (template engine)
- Express.js (server-side rendering)

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- Passport.js (authentication)
- CORS for cross-origin requests

**Deployment:**
- Render (Backend + Frontend)
- MongoDB Atlas (Cloud Database)

## 📁 Project Structure

```
KGLPPRO/
├── api/                    # Backend server setup
│   └── index.js           # Main app configuration
├── routes/                # API routes
│   ├── authRoutes.js      # Authentication
│   ├── saleRoutes.js      # Sales management
│   ├── productRoutes.js   # Product management
│   ├── creditRoutes.js    # Credit management
│   ├── directorRoutes.js  # Director functions
│   ├── managerRoutes.js   # Manager functions
│   └── ...
├── models/                # Mongoose schemas
│   ├── Signup.js          # User model
│   ├── Sale.js            # Sales model
│   ├── Product.js         # Products model
│   ├── Credit.js          # Credits model
│   └── ...
├── views/                 # Pug templates
│   ├── login.pug          # Login page
│   ├── director-dashboard.pug
│   ├── manager-dashboard.pug
│   └── ...
├── public/                # Static files
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side scripts
│   └── img/               # Images
├── .env                   # Environment variables
├── server.js              # Entry point
├── package.json           # Dependencies
└── render.yaml            # Render deployment config
```

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local) or MongoDB Atlas account
- Git

### Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd KGLPPRO

# Install dependencies
npm install

# Install CORS
npm install cors
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/kgl_management?appName=Cluster0

# Server
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=https://final-project-16-6m3b.onrender.com

# Session
SESSION_SECRET=your_session_secret_key

# JWT
JWT_SECRET=your_jwt_secret_key
```

### Local Development Setup

For local development with local MongoDB:

```env
DATABASE=mongodb://localhost:27017/kgl_management
PORT=3000
FRONTEND_URL=http://localhost:3000
```

## 🚀 Local Development

### Start MongoDB (if running locally)

```bash
# Windows
mongod

# Or use MongoDB Compass GUI
```

### Run the Application

```bash
# Start the server
npm start

# Or use nodemon for development
npm run dev
```

Visit: `http://localhost:3000`

## 🌐 Deployment (Render)

### Prerequisites
1. MongoDB Atlas account with:
   - Cluster created
   - Database user created
   - IP whitelist: `0.0.0.0/0` (allows all IPs)

2. Render account

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://dashboard.render.com
   - Create new Web Service
   - Connect your GitHub repository
   - Choose `main` branch

3. **Configure Environment**
   - Go to Environment tab
   - Add these variables:
     - `DATABASE`: Your MongoDB Atlas connection string
     - `PORT`: 3000
     - `FRONTEND_URL`: Your Render URL
     - `SESSION_SECRET`: Secure random string
     - `JWT_SECRET`: Secure random string

4. **Deploy**
   - Click "Deploy"
   - Wait 5-10 minutes
   - Access at: `https://final-project-16-6m3b.onrender.com`

## 📡 API Routes

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /logout` - User logout

### Sales
- `GET /sales` - View all sales
- `POST /sales` - Create sale
- `PUT /sales/:id` - Update sale
- `DELETE /sales/:id` - Delete sale

### Products
- `GET /products` - View all products
- `POST /products` - Add product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Credits
- `GET /credits` - View all credits
- `POST /credits` - Create credit
- `PUT /credits/:id` - Update credit

### Directors
- `GET /director-dashboard` - Director dashboard

### Managers
- `GET /manager-dashboard` - Manager dashboard

### Sales Agents
- `GET /sales-agent-dashboard` - Sales agent dashboard

## 💾 Database Models

### User (Signup)
- username
- password (hashed)
- email
- userType (Director, Manager, Sales Agent)
- branch

### Product
- produceName
- produceType
- procureDate
- tonnage
- cost
- dealerName
- branchName
- sellPrice

### Sale
- produceName
- saleDate
- quantitySold
- pricePerKg
- buyerName
- branchName
- paymentMode

### Credit
- customerName
- creditAmount
- creditDate
- dueDate
- branchName
- status

## 🔧 Troubleshooting

### MongoDB Connection Error
**Problem:** "buffering timed out after 10000ms"
**Solution:**
1. Verify DATABASE variable is set correctly
2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Verify database credentials (username/password)

### CORS Errors
**Problem:** Cross-origin requests blocked
**Solution:**
1. Ensure CORS middleware is configured
2. Check FRONTEND_URL environment variable
3. Verify frontend is making requests to correct backend URL

### SSL/TLS Errors
**Problem:** SSL certificate verification failed
**Solution:**
1. Regenerate MongoDB Atlas password
2. Update Render environment variables
3. Redeploy

## 👥 User Roles

- **Director**: Full system access, view all branches
- **Manager**: Manage products and sales for assigned branch
- **Sales Agent**: Record sales transactions
- **Admin**: System administration

## 📝 Development Notes

- Use Pug templates for server-side rendering
- Validate all user inputs on server-side
- Use Passport.js for session management
- MongoDB uses automatic indexing for performance

## 📞 Support

For issues or questions, check the logs:
- **Local**: Console output
- **Render**: Dashboard → Logs tab

## 📄 License

This project is proprietary software. All rights reserved.
