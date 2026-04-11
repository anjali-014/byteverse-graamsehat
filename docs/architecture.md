# System Architecture

GraamSehat follows a modular microservices-based architecture.

## Components

- Frontend (React)
- Backend (Node.js + Express)
- Database (PostgreSQL)
- Cache (Redis)
- ML Service (Python)

---

## Data Flow

1. ASHA enters patient data
2. Backend validates & stores data
3. Data sent to ML service for prediction
4. Results returned to backend
5. Dashboard updates in real-time

---

## Design Principles

- Scalability
- Fault tolerance
- Low latency
- Offline-first capability