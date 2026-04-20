import os
from typing import TypedDict, List
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END

# Import the indexer you built in the previous step
from core.indexing import FrameIndexer

# Load environment variables
load_dotenv()

# 1. Define the State
class AgentState(TypedDict):
    telemetry: dict
    frame: dict
    analysis: str
    is_alert: bool
    logs: List[str]

# 2. Initialize Components
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("CRITICAL: OPENAI_API_KEY not found in .env file.")

# Using gpt-4o-mini: Fast, cheap, and perfect for reasoning on CPU-based backends
llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=api_key,
    temperature=0
)

indexer = FrameIndexer()

# 3. Define the Reasoning Node
def analyze_security_node(state: AgentState):
    """
    Analyzes telemetry and vision data to determine security risk.
    """
    prompt = f"""
    You are an expert Drone Security Analyst. 
    Analyze the following real-time data:
    
    Telemetry: {state['telemetry']}
    Vision Frame Description: {state['frame']['description']}
    
    CRITERIA FOR ALERT:
    - Suspicious activity (loitering, unknown vehicles).
    - Unauthorized timing (activities near the gate after 10 PM).
    - Drone safety issues (altitude below 5 meters).

    Provide a brief analysis and mark 'is_alert' as true if security action is needed.
    """
    
    response = llm.invoke(prompt)
    content = response.content.lower()
    
    # Logic: Alert if LLM flags it OR if altitude is dangerously low
    is_alert = "true" in content or "suspicious" in content or state['telemetry']['altitude'] < 5
    
    return {"analysis": response.content, "is_alert": is_alert}

# 4. Define the Indexing Node
def index_data_node(state: AgentState):
    """
    Saves the analyzed frame into ChromaDB for historical search.
    """
    indexer.index_frame(
        frame_id=state['frame']['frame_id'],
        description=state['frame']['description'],
        metadata={
            "timestamp": state['telemetry']['timestamp'],
            "altitude": state['telemetry']['altitude'],
            "is_alert": str(state['is_alert']),
            "analysis": state['analysis'][:100] # Store snippet
        }
    )
    return {"logs": [f"Frame {state['frame']['frame_id']} indexed successfully."]}

# 5. Build the LangGraph Workflow
workflow = StateGraph(AgentState)

workflow.add_node("analyze", analyze_security_node)
workflow.add_node("index", index_data_node)

workflow.set_entry_point("analyze")
workflow.add_edge("analyze", "index")
workflow.add_edge("index", END)

# Compile the agent
agent_executor = workflow.compile()