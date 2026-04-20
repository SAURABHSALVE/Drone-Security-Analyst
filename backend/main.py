import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import local core modules
from core.simulation import DroneSimulator
from core.agent import agent_executor, indexer

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Drone Security Analyst API",
    description="Backend for real-time drone telemetry and security analysis."
)

# Enable CORS for your ReactJS Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup verification
@app.on_event("startup")
async def verify_configs():
    key = os.getenv("OPENAI_API_KEY")
    if not key or not key.startswith("sk-"):
        print("[-] WARNING: Invalid or missing OpenAI API Key in .env")
    else:
        print("[+] Drone Analyst Backend connected to OpenAI successfully.")

sim = DroneSimulator()

# --- API Endpoints ---

@app.get("/status")
def get_drone_status():
    """Returns simulated drone telemetry (GPS, Altitude, Battery)."""
    return sim.generate_telemetry()

@app.get("/stream")
def get_video_stream():
    """Returns the latest simulated VLM frame description."""
    return sim.generate_frame_description()

@app.post("/process-tick")
async def process_drone_tick():
    """
    Executes one cycle of the Agentic Workflow:
    1. Ingests simulated drone data.
    2. Runs LangGraph reasoning to detect threats.
    3. Indexes the frame in ChromaDB.
    """
    telemetry = sim.generate_telemetry()
    frame = sim.generate_frame_description()
    
    inputs = {
        "telemetry": telemetry, 
        "frame": frame, 
        "logs": []
    }
    
    # Run the compiled LangGraph
    result = await agent_executor.ainvoke(inputs)
    
    return {
        "status": "success",
        "analysis": result.get("analysis"),
        "is_alert": result.get("is_alert"),
        "telemetry": telemetry,
        "frame": frame
    }

@app.get("/search")
def search_history(
    query: str = Query(..., description="Query (e.g., 'blue truck')")
):
    """Cross-Domain Search: Retrieves frames from ChromaDB."""
    results = indexer.search_frames(query)
    return {
        "query": query,
        "results": results
    }

@app.get("/")
def health_check():
    return {"status": "online", "message": "Drone Security Agent is active."}