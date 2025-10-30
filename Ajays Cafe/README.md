# AJAYS Cafe - Full Stack Application

A complete restaurant management system with customer ordering and admin panel.

## 🏗️ Project Structure
```
├── frontend/
│   ├── customer/          # Customer ordering interface
│   └── admin/             # Admin management panel
└── backend/               # Java Spring Boot API
```

## 🚀 Setup Instructions

### Backend Setup

1. **Prerequisites:**
   - Java 17 or higher
   - Maven 3.6+

2. **Run Backend:**
```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
```

3. **Backend runs on:** `http://localhost:8080`

4. **API Endpoints:**
   - Orders: `http://localhost:8080/api/orders`
   - Menu: `http://localhost:8080/api/menu`
   - H2 Console: `http://localhost:8080/h2-console`

### Frontend Setup

1. **Customer Interface:**
   - Open `frontend/customer/index.html` in browser
   - Or use Live Server in VS Code

2. **Admin Panel:**
   - Open `frontend/admin/index.html` in browser
   - Update `API_BASE_URL` in `admin.js` if backend is deployed

## 📱 Features

### Customer Side
- Browse menu by categories
- Add items to cart
- Place orders with name and phone
- Real-time order total

### Admin Side
- Dashboard with statistics
- Order management (Accept/Reject/Complete)
- Menu management (Add/Edit/Delete items)
- Filter orders by status
- Search functionality

## 🔧 Configuration

### Update Backend URL
In `frontend/admin/admin.js`, change:
```javascript
const API_BASE_URL = 'YOUR_DEPLOYED_BACKEND_URL';
```

### Database Configuration
- Development: Uses H2 in-memory database
- Production: Configure MySQL in `application.properties`

## 📦 Deployment

### Backend (Java)
- Deploy to: Render, Railway, Heroku, AWS
- Build command: `mvn clean package`
- Start command: `java -jar target/cafe-backend-1.0.0.jar`

### Frontend
- Deploy to: GitHub Pages, Netlify, Vercel
- Simply push the `frontend` folder

## 🌐 GitHub Pages Deployment

1. Push code to GitHub
2. Go to Settings → Pages
3. Select branch and `/frontend` folder
4. Access via: `https://yourusername.github.io/your-repo`

## 📄 License

© 2025 AJAYS Cafe - All Rights Reserved