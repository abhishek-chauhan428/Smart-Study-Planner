# 🚀 Smart Study Planner

## 📌 Overview

Smart Study Planner is a modern productivity web application designed to help students and professionals plan, execute, and improve their study habits. It combines task management, Pomodoro-based focus sessions, and AI-powered insights into a single seamless experience.

---

## 🎯 Problem It Solves

Managing academic or professional work can be overwhelming. Most tools either:

* Only manage tasks (to-do lists)
* Or only track time (Pomodoro apps)

They rarely provide:

* Integrates task management with a Pomodoro timer, helping students plan effectively and stay focused during study sessions.
* Feedback on performance
* Plan effective with the help of AI
* Actionable improvement strategies with the help of AI

**Smart Study Planner bridges this gap** by integrating planning, execution, and analysis—enhanced with AI-driven recommendations.

---

## ✨ Key Features

### 📝 Task Management

* Create, edit, and delete tasks
* Set deadlines and estimated durations
* Track completion status (pending/completed)

### ⏳ Focus Timer (Pomodoro)

* Add focus sessions by specifying total session duration, work interval (slot), and break duration
* It will divide the whole session into appropriate slots as per the input given.
* Link sessions directly to tasks.
* Option to add custon focus sessions as well.
* After each focus session, users provide an efficiency rating (1–5), which the system analyzes to generate insights and help improve productivity.

### 🔄 Persistent Data and Timer

* Uses absolute timestamps
* Timer stays accurate even after:
  * Browser refresh
  * Tab close/reopen/relogin
* User log ins and logs out but user data remain saved therby helping establise connection between use and the system more and more data about user better way for the AI to make user improve  




### Summary Dashboard

- View tasks scheduled for today  
- Track total study duration and completion rate  of that perticular day.
- See estimated time required to complete today’s tasks 
- Meet with you AI coach  


### 🤖 AI Study Coach

* Generates personalized weekly study strategies
* By analysing:
  - Your goals
  - Recent study patterns
  - Your efficiency rating
  - Study Duration
  - Completion Rate
  
* Analyzes user study data to identify key areas of improvement and provide actionable insights
* Powered by Google Gemini API

### ☁️ Cloud Sync

* Firebase Authentication for secure login
* Firestore for real-time data storage

### 📊 Analytics Dashboard

* Visual insights into:
  * Total focus time
  * Task completion rate
  * Study consistency
  * Average focus score

---

## 🏗️ Tech Stack & Architecture

### ⚛️ Frontend
- React (v19) – Component-based UI  
- Vite – Fast build tool with HMR  
- Tailwind CSS – Utility-first styling  
- React Router – Client-side routing  
- Recharts – Data visualization  

---

### 🔥 Backend & Services
- Firebase Authentication – User auth & session handling  
- Firestore – Real-time database (tasks & sessions)  
- Gemini API – AI-powered study recommendations  

---

### 🧠 State Management
- React Context API:
  - AuthProvider – authentication  
  - TaskProvider – task management  
  - SessionProvider – timer & sessions  

---

### 💾 Storage
- Firestore – persistent, cloud-synced data  
- localStorage – timer persistence & session recovery  

---

## 🧩 Core Concepts Used
- Virtual DOM & efficient rendering  
- React Hooks (`useState`, `useEffect`,`useRef`,etc.)  
- Controlled forms & validation  
- Client-side routing & protected routes  
- Real-time updates with Firestore  

---

## ⚡ Performance Optimizations
- Memoization (`useMemo`)  
- Stable callbacks (`useCallback`)  
- Code splitting with lazy loading  
- Retry logic with exponential backoff for API calls  

---

## 🔄 Additional Features
- Real-time data sync using Firestore (`onSnapshot`)  
- Persistent timer using absolute timestamps  
- Lazy loading for faster initial load  

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-study-planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open the App

Visit: [https://github.com/abhishek-chauhan428/Smart-Study-Planner]

---

## ⚠️ Known Limitations

### Gemini API Rate Limits

* Free-tier usage may lead to:

  * "High Demand" errors
* Mitigation:

  * Retry logic with exponential backoff implemented




## 💡 Final Note

This project is designed to go beyond a basic CRUD app by combining behavior tracking, analytics, and AI to create a **complete productivity system**.

---

## 📷 (Optional)

*Add screenshots or demo GIFs here to showcase your UI and features.*
