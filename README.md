# GraamSehat 🏥

AI-powered rural health monitoring system that enables ASHA workers to track patients, analyze health risks, and improve rural healthcare delivery using real-time data and machine learning.

---

## 🚀 Problem Statement

Rural healthcare systems face major challenges:

* No real-time patient monitoring
* Poor data synchronization across systems
* Lack of predictive healthcare tools
* Heavy dependence on manual processes

---

## 💡 Solution

GraamSehat solves these problems by providing:

* 📱 A digital platform for ASHA workers
* 🧠 AI-based health risk prediction
* 📊 Real-time dashboard for insights
* 🔄 Offline-first data sync system

---

## ✨ Key Features

* ASHA Worker Registration System
* Patient Case Tracking & Sync
* AI-based Risk Prediction
* Health Analytics Dashboard
* Scalable Backend Architecture

---

## 🏗️ Tech Stack

**Backend**

* Node.js + Express
* PostgreSQL
* Redis

**Frontend**

* React (Vite)

**ML Service**

* Python
* TensorFlow / Scikit-learn

---

## 📂 Project Structure

```
graamsehat/
├── backend/        # API and database logic
├── frontend/       # User interface (React)
├── ml-service/     # Machine learning model
├── docs/           # Documentation
├── tests/          # Test files
```

---

## 🔌 API Endpoints

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | /api/asha/register     | Register ASHA worker    |
| GET    | /api/asha/:phone       | Fetch ASHA details      |
| POST   | /api/sync/cases        | Sync patient cases      |
| GET    | /api/dashboard/summary | Get dashboard analytics |

---

## ⚙️ How to Run the Project

### 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/graamsehat.git
cd graamsehat
```

---

### 2. Start Backend

```
cd backend
npm install
npm run dev
```

---

### 3. Start Frontend

```
cd frontend
npm install
npm run dev
```

---

### 4. Start ML Service

```
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## 📊 Pre-built Assets

* PostgreSQL database
* Redis caching system
* Machine learning libraries (TensorFlow, Scikit-learn)

---

## 🧠 Future Scope

* Mobile application for ASHA workers
* Real-time alert system
* Telemedicine integration
* Advanced AI models

---

## 👤 Author

Aditya Narayan

---

## 📜 License

This project is licensed under the MIT License.
