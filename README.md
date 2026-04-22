# 🚁 Drone Security Analyst System

A real-time drone security analysis platform powered by AI that detects threats through intelligent telemetry analysis and visual understanding. Built with modern web technologies and advanced LLM reasoning.

![Drone Security](https://img.shields.io/badge/AI-Powered-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-LLM-green?style=flat-square)

---

## 🎯 Features

- **🔴 Real-Time Threat Detection** - AI-powered analysis of drone telemetry and video feeds
- **📊 Live Telemetry Dashboard** - Monitor altitude, battery, GPS location in real-time
- **🎥 Vision Analysis** - VLM (Vision Language Model) descriptions of video frames
- **🚨 Smart Alert System** - Flags suspicious activity (loitering, unknown vehicles, safety concerns)
- **🔍 Semantic Search** - Search historical drone footage using natural language (e.g., "blue truck")
- **📦 Vector Database** - ChromaDB for efficient semantic similarity search
- **🤖 LangGraph Workflows** - Multi-step agentic reasoning for decision-making
- **🌐 REST API** - Clean FastAPI endpoints for all functionality
- **💻 Cyberpunk UI** - Modern, responsive dashboard with real-time updates

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  • Live Telemetry Display                                   │
│  • Real-time Alert Feed                                     │
│  • Semantic Search Interface                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Layer                                            │  │
│  │ • /status      - Drone telemetry                     │  │
│  │ • /stream      - Video frame description            │  │
│  │ • /process-tick - Agentic workflow execution        │  │
│  │ • /search      - Semantic search                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │ Drone Simulator  │  │ LangGraph Agent  │  │ Indexer  │ │
│  │ • Telemetry Gen  │  │ • Threat Analysis│  │          │ │
│  │ • Frame Desc     │  │ • LLM Reasoning  │  │ ChromaDB │ │
│  │                  │  │ • Decision Logic │  │          │ │
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                       ↓ OpenAI API
                    GPT-4o-mini
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API Key (get one at [platform.openai.com](https://platform.openai.com))

### Installation & Setup

#### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo OPENAI_API_KEY=sk-your-key-here > .env

# Start the backend server
uvicorn main:app --reload
```

Backend will run on: `http://localhost:8000`

#### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

#### 3️⃣ Access the Application

Open your browser and navigate to: **http://localhost:5173**

You should see the cyberpunk-themed Drone Security Dashboard with live data streaming in.

---

## 📡 API Documentation

### Core Endpoints

#### `GET /status`
Returns current drone telemetry data.

**Response:**
```json
{
  "timestamp": "2026-04-22T10:30:45.123456",
  "altitude": 25.43,
  "position": {
    "lat": 18.5204,
    "lng": 73.8567
  },
  "battery": 78
}
```

---

#### `GET /stream`
Returns the latest VLM-generated video frame description.

**Response:**
```json
{
  "frame_id": 5432,
  "description": "Blue Ford F150 truck approaching the entrance.",
  "timestamp": "2026-04-22T10:30:45.123456"
}
```

---

#### `POST /process-tick`
Executes one cycle of the agentic workflow:
1. Ingests simulated drone data
2. Runs LLM reasoning to detect threats
3. Indexes the frame in ChromaDB

**Response:**
```json
{
  "status": "success",
  "analysis": "The blue F150 truck is a delivery vehicle. No security threat detected.",
  "is_alert": false,
  "telemetry": { ... },
  "frame": { ... }
}
```

---

#### `GET /search?query=<search_query>`
Searches historical drone footage using semantic similarity.

**Example:** `GET /search?query=blue truck`

**Response:**
```json
{
  "query": "blue truck",
  "results": {
    "documents": [
      ["Blue Ford F150 truck approaching the entrance.", "Delivery van dropping off a package..."],
      ...
    ],
    "distances": [0.12, 0.45, ...],
    "metadatas": [[{"timestamp": "...", "altitude": 25.43, ...}], ...]
  }
}
```

---

#### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "message": "Drone Security Agent is active."
}
```

---

## 📁 Project Structure

```
Drone-Simulation-System/
├── backend/
│   ├── main.py                 # FastAPI application & endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (create this)
│   ├── chroma_db/              # ChromaDB persistent storage
│   └── core/
│       ├── __init__.py
│       ├── simulation.py        # DroneSimulator class
│       ├── agent.py            # LangGraph agentic workflow
│       └── indexing.py         # FrameIndexer for ChromaDB
│
├── frontend/
│   ├── package.json            # Node dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── index.html              # HTML entry point
│   ├── postcss.config.js       # PostCSS configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── public/                 # Static assets
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Main app component
│       ├── App.css             # Styles
│       ├── index.css           # Global styles
│       └── assets/             # Images, icons
│
└── README.md                   # This file
```

---

## ⚙️ Configuration

### Environment Variables (.env)

Create a `.env` file in the `backend/` directory:

```env
# Required: Your OpenAI API Key
OPENAI_API_KEY=sk-your-api-key-here

# Optional: Set LLM model (default: gpt-4o-mini)
# LLM_MODEL=gpt-4o-mini

# Optional: Database path
# DB_PATH=./chroma_db
```

---

## 🔄 How It Works

### Threat Detection Workflow

1. **Data Generation**
   - Drone simulator generates random telemetry (altitude, GPS, battery)
   - VLM generates realistic scenario descriptions

2. **AI Analysis**
   - LangGraph orchestrates the workflow
   - GPT-4o-mini analyzes: telemetry + vision description
   - LLM checks for suspicious activity criteria:
     - Loitering near perimeter
     - Unknown vehicles
     - Unauthorized timing (after 10 PM)
     - Dangerous altitude (< 5m)

3. **Indexing**
   - Frame description is embedded using ChromaDB
   - Stored with metadata (timestamp, altitude, alert status)

4. **Search**
   - Users can query historical data with natural language
   - Vector similarity finds relevant frames instantly

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **LangChain** - Framework for building LLM applications
- **LangGraph** - Multi-step agentic reasoning workflows
- **ChromaDB** - Vector database for semantic search
- **OpenAI API** - GPT-4o-mini for threat analysis
- **Uvicorn** - ASGI server for running FastAPI

### Frontend
- **React 18** - UI library for building interactive interfaces
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **PostCSS + Autoprefixer** - CSS processing

---

## 🎨 Frontend Features

### Dashboard Components

**1. Telemetry Panel**
- Real-time altitude, battery, and GPS location
- Updates every 5 seconds from backend

**2. Frame Description (VLM Output)**
- Live video feed analysis
- Natural language description of what's happening

**3. Threat Log**
- Alert history (last 5 alerts)
- Timestamp and analysis reason
- Color-coded status indicators

**4. Search Interface**
- Semantic search for historical footage
- Search by objects, activities, or people
- Results with metadata and confidence

---

## 🚨 Alert Criteria

The system triggers an alert when:

```python
✓ Suspicious activity detected (loitering, unknown vehicles)
✓ Unauthorized timing (activities after 10 PM)
✓ Drone safety issue (altitude < 5 meters)
✓ LLM confidence score > 0.7 for threat
```

---

## 🧪 Testing the System

### Manual Testing Steps

1. **Start both servers** (backend on 8000, frontend on 5173)
2. **Open dashboard** at http://localhost:5173
3. **Watch live telemetry** - Updates every 5 seconds
4. **Observe alerts** - Threats appear in the threat log when detected
5. **Test search** - Try searching:
   - "blue truck" → finds delivery vehicle scenarios
   - "loitering" → finds suspicious activity
   - "person hoodie" → finds suspicious individuals

### API Testing (cURL)

```bash
# Get drone status
curl http://localhost:8000/status

# Get video frame description
curl http://localhost:8000/stream

# Process one tick
curl -X POST http://localhost:8000/process-tick

# Search for frames
curl "http://localhost:8000/search?query=blue%20truck"

# Health check
curl http://localhost:8000/
```

---

## 📊 Sample Scenarios

The system simulates these real-world scenarios:

1. **Normal Operations**
   - Clear sky, no activity at main gate
   - Routine delivery van arrivals

2. **Suspicious Activity**
   - Person in hoodie loitering near perimeter fence
   - Unknown individuals attempting to open side gate

3. **Vehicle Monitoring**
   - Blue Ford F150 truck approaching entrance
   - Unauthorized vehicles near restricted zones

4. **Safety Issues**
   - Altitude drops below safe thresholds
   - Battery critical levels

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "OPENAI_API_KEY not found"**
- Solution: Create `.env` file in backend directory with your API key

**Error: "Connection refused on port 8000"**
- Solution: Make sure you're in the backend directory and ran `uvicorn main:app --reload`

**Error: "ModuleNotFoundError: No module named 'langchain'"**
- Solution: Ensure virtual environment is activated and run `pip install -r requirements.txt`

### Frontend Issues

**Error: "Cannot find module 'axios'"**
- Solution: Run `npm install` in the frontend directory

**Error: "Failed to fetch from localhost:8000"**
- Solution: Ensure backend is running. Check CORS is enabled in FastAPI

**Blank screen or no data**
- Solution: Check browser console for errors. Verify both servers are running.

---

## 📈 Future Enhancements

- [ ] Real drone integration (DJI SDK)
- [ ] Multiple drone support
- [ ] Advanced analytics dashboard
- [ ] Machine learning model training
- [ ] Multi-camera support
- [ ] Database persistence (PostgreSQL)
- [ ] Authentication & authorization
- [ ] Real-time WebSocket streaming
- [ ] Export alerts to PDF/email
- [ ] Mobile app support

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section above

---

## 🎬 Video Demo

Check out the 5-minute explanation video on YouTube showing:
- Live dashboard functionality
- Threat detection in action
- Semantic search capabilities
- Architecture walkthrough

---

## 👨‍💻 Authors

Built with ❤️ for advanced security analysis systems.

---

**Last Updated:** April 2026  
**Version:** 1.0.0
