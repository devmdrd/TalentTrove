# TalentTrove
## 🚀 Live Demo
🔗 [TalentTrove Live](https://talenttrove.online/)

## 📌 Overview
**TalentTrove** is a comprehensive job portal designed to connect job seekers with their ideal career opportunities. It provides an intuitive platform for job searching, recruitment, and talent acquisition with modern features and a seamless user experience.

## ✨ Features
* 🌍 **Job Listings** – Browse through various job posts across different industries and locations
* 🔍 **Advanced Search & Filter** – Easily find jobs based on company, location, experience level, and required skills
* 📝 **Apply Online** – Submit applications directly through the portal with resume upload functionality
* 👥 **Employer Dashboard** – Companies can post jobs, manage applicants, and track application status
* 📊 **Analytics & Insights** – Track job postings, candidate engagement, and application metrics
* 📧 **Email Notifications** – Automated email updates for application status changes and new job matches
* 🔐 **Google Authentication** – Secure and convenient sign-in with Google account integration
* 📱 **Responsive Design** – Optimized experience across desktop, tablet, and mobile devices

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Tokens), Google OAuth 2.0
* **Email Service:** Nodemailer with Gmail SMTP
* **Hosting:** Render (Frontend & Backend)
* **CI/CD:** GitHub Actions

## 🏗️ Installation & Setup
To set up the project locally, follow these steps:

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/devmdrd/TalentTrove.git
cd talenttrove  
```

### 2️⃣ Install Dependencies
#### Frontend:
```sh
cd client  
npm install  
npm run dev 
```

#### Backend:
```sh
cd server  
npm install  
npm install nodemon --save-dev  # Install nodemon as dev dependency
npm run dev  
```

### 3️⃣ Environment Variables
Create `.env` files in server directory:

#### server `.env`:
```
# Port
PORT=3001

# Base URL
BASE_URL=https://talenttrove-ivhm.onrender.com/api

# Client URL
CLIENT_URL=https://talenttrove.online

# Google OAuth credentials
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

# MongoDB connection URI
MONGO_URI=mongodb+srv://<your_mongo_username>:<your_mongo_password>@cluster0.f3o2udq.mongodb.net/TalentTrove

# Email credentials
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_email_app_password>

# JWT Access Token Secret
ACCESS_TOKEN_SECRET=<your_access_token_secret>
```

### 4️⃣ Run the Project
Start both frontend and backend servers:
```sh
# In the client directory
npm run dev

# In the server directory
npm run dev  
```
Now, visit `http://localhost:3000/` in your browser.

## 🚀 Deployment on Render
### 1️⃣ Deploy Frontend on Render
* Push your project to GitHub
* Log in to [Render](https://render.com/) and create a new Web Service
* Connect your GitHub repository
* Select the following settings:
  * **Name:** talenttrove-frontend (or your preferred name)
  * **Environment:** Static Site
  * **Build Command:** `cd client && npm install && npm run build`
  * **Publish Directory:** `client/dist`
* Add environment variables under the "Environment" tab
* Click "Create Web Service"

### 2️⃣ Deploy Backend on Render
* Create another Web Service on Render
* Connect the same GitHub repository
* Select the following settings:
  * **Name:** talenttrove-api (or your preferred name)
  * **Environment:** Node
  * **Build Command:** `cd server && npm install`
  * **Start Command:** `cd server && npm start`
* Add all the required environment variables:
  * `MONGO_URI`
  * `JWT_SECRET`
  * `GOOGLE_CLIENT_ID`
  * `GOOGLE_CLIENT_SECRET`
  * `EMAIL_USER`
  * `EMAIL_PASS`
  * `CLIENT_URL` (your frontend Render URL)
* Click "Create Web Service"

## 📧 Email Service Configuration
TalentTrove uses Nodemailer with Gmail SMTP for sending email notifications:

### Setting up Gmail for Nodemailer:
1. Enable 2-Step Verification for your Gmail account
2. Generate an App Password:
   * Go to your Google Account → Security → App passwords
   * Select "Mail" as the app and "Other" as the device
   * Use the generated 16-character password as your `EMAIL_PASS` in environment variables

## 🔐 Google Authentication Setup
To enable Google Sign-In functionality:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Set up OAuth 2.0 credentials:
   * Configure the OAuth consent screen
   * Create OAuth client ID credentials
   * Add authorized JavaScript origins and redirect URIs
3. Use the generated Client ID and Client Secret in your environment variables

## 📂 Project Structure
```
/TalentTrove
│── /client 
│   │── /dist            # Production build files
│   │── /node_modules
│   │── /public          # Public assets
│   │── /src             # React source directory
│   │   │── /assets      # Static assets
│   │   │── /components  # Reusable components
│   │   │── /config      # Configuration files
│   │   │── /features    # Feature-specific code
│   │   │── /helpers     # Helper functions
│   │   │── /pages       # Page components
│   │   │── /routes      # Frontend routing 
│   │   │── /utils       # Utility functions
│   │   │── App.css      
│   │   │── App.jsx      # Main App component
│   │   │── Index.css    
│   │   │── main.jsx     # Application entry point
│   │   │── store.js     # Redux store configuration
│   │── .eslintrc.cjs
│   │── .gitignore       
│   │── index.html       # Main HTML file
│   │── package.json     # Frontend dependencies
│   │── vite.config.js   # Vite configuration
│── /server           
│   │── /node_modules    
│   │── /src             # Backend source code      
│   │   │── /api         # API-related files
│   │   │   │── /controllers  # Business logic controllers
│   │   │   │── /middlewares  # Middleware functions
│   │   │   │── /models       # Database models
│   │   │   │── /public       # Public assets
│   │   │   │── /routes       # API routes
│   │   │   │── /services     # Backend services
│   │   │── /config      # Configuration files
│   │   │── /utils       # Utility functions
│   │   │── server.js    # Main backend server file
│   │── .env             # Environment variables
│   │── package.json     # Backend dependencies
│   │── package-lock.json
│── .gitignore           # Git ignore file
│── README.md            # Project documentation
```

## 📞 Contact
For any inquiries or support, reach out to [Muhammed Rashid](mailto:mdrd.muhammedrashid@gmail.com).