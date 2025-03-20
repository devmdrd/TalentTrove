# TalentTrove  

## 🚀 Live Demo  
🔗 [TalentTrove Live](https://talenttrove.live/)  

## 📌 Overview  
**TalentTrove** is a job portal designed to connect job seekers with their ideal career opportunities. It provides an intuitive platform for job searching, recruitment, and talent acquisition.  

## ✨ Features  
- 🌍 **Job Listings** – Browse through various job posts.  
- 🔍 **Search & Filter** – Easily find jobs based on company, location, and skills.  
- 📝 **Apply Online** – Submit applications directly through the portal.  
- 👥 **Employer Dashboard** – Companies can post jobs and manage applicants.  
- 📊 **Analytics & Insights** – Track job postings and candidate engagement.  

## 🛠️ Tech Stack  
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Hosting:** Vercel (Frontend & Backend)  

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
npm start  
```  
#### Backend:  
```sh  
cd server  
npm install  
npm run dev  
```

### 3️⃣ Run the Project  
Start both frontend and backend servers:  
```sh  
npm run dev  
```  
Now, visit `http://localhost:3000/` in your browser.  

## 🚀 Deployment on Vercel  
### 1️⃣ Deploy Frontend on Vercel  
- Push your project to GitHub.  
- Go to [Vercel](https://vercel.com/) and import your **frontend** repository.  
- Set the necessary environment variables.  
- Deploy and get your live frontend link.  

### 2️⃣ Deploy Backend on Vercel  
- Go to [Vercel](https://vercel.com/) and import your **backend** repository.  
- Add the required environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).  
- Deploy and get your live backend API URL.  

## 📂 Project Structure  
```
/TalentTrove
│── /client           # Frontend source code
│   │── /src          # React source directory
│   │   │── /assets   # Static assets
│   │   │── /components # Reusable components
│   │   │── /features/auth # Authentication-related code
│   │   │── /helpers  # Helper functions
│   │   │── /pages    # Page components
│   │   │── /routes   # Frontend routing
│   │   │── /services # API services
│   │   │── /utils    # Utility functions
│   │   │── App.jsx   # Main App component
│   │   │── main.jsx  # Application entry point
│   │── .vscode       # VS Code settings
│   │── index.html    # Main HTML file
│   │── package.json  # Frontend dependencies
│   │── tailwind.config.js # Tailwind CSS configuration
│   │── vite.config.js # Vite configuration
│── /server           # Backend source code
│   │── /src          # API-related files
│   │   │── /api      # API endpoints
│   │   │   │── /controllers  # Business logic controllers
│   │   │   │── /middlewares  # Middleware functions
│   │   │   │── /models       # Database models
│   │   │   │── /public       # Public assets
│   │   │   │── /routes       # API routes
│   │   │   │── /services     # Backend services
│   │   │── config            # Configuration files
│   │   |── server.js         # Main backend server file
│   │── package.json      # Backend dependencies
│── .gitignore           # Git ignore file
│── README.md            # Project documentation
```  

---  

## 🤝 Contributing  
Contributions are welcome! Please follow these steps:  
1. Fork the repository  
2. Create a new branch (`feature-branch`)  
3. Commit your changes  
4. Push to your fork  
5. Submit a pull request  

## 📜 License  
This project is licensed under the MIT License.  

## 📞 Contact  
For any inquiries or support, reach out to [Muhammed Rashid](mailto:muhammedrashid@gmail.com).  
