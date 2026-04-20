import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import local core modules
from core.simulation import DroneSimulator
from core.agent import agent_executor, indexer

# Load environment variables (OpenAI API Key)
load_dotenv()

app = FastAPI(
    title="Drone Security Analyst API",
    description="AI Agent for processing drone telemetry and security video frames[cite: 12, 17]."
)

# 1. Enable CORS for your ReactJS Dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to specific React port (e.g., http://localhost:5173) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Data Simulator
sim = DroneSimulator()

# --- Endpoints ---

@app.get("/status")
def get_drone_status():
    """
    Returns current simulated drone telemetry.
    Includes position, altitude, and battery metrics.
    """
    return sim.generate_telemetry()

@app.get("/stream")
def get_video_stream():
    """
    Returns the latest simulated video frame description[cite: 19, 28].
    Mocking the output of a Vision-Language Model (VLM)[cite: 80].
    """
    return sim.generate_frame_description()

@app.post("/process-tick")
async def process_drone_tick():
    """
    The Agentic Core: Triggers a single reasoning cycle[cite: 15, 81].
    1. Ingests Telemetry & Vision data[cite: 18].
    2. Runs LangGraph workflow to analyze security context[cite: 20].
    3. Indexes the result for future search.
    """
    telemetry = sim.generate_telemetry()
    frame = sim.generate_frame_description()
    
    # Execute the LangGraph workflow
    inputs = {
        "telemetry": telemetry, 
        "frame": frame, 
        "logs": []
    }
    
    # ainvoke is used for asynchronous execution
    result = await agent_executor.ainvoke(inputs)
    
    return {
        "status": "success",
        "analysis": result.get("analysis"),
        "is_alert": result.get("is_alert"),  # Generates real-time security alerts[cite: 14, 20].
        "telemetry": telemetry,
        "frame": frame
    }

@app.get("/search")
def search_history(
    query: str = Query(..., description="Search query for indexed frames (e.g., 'blue truck')[cite: 37].")
):
    """
    Cross-Domain Search: Queries the ChromaDB vector index[cite: 21, 31].
    Allows property owners to retrieve historical security events[cite: 14].
    """
    results = indexer.search_frames(query)
    return {
        "query": query,
        "results": results
    }

# --- Health Check ---
@app.get("/")
def health_check():
    return {"message": "Drone Security Analyst Agent is Online"}