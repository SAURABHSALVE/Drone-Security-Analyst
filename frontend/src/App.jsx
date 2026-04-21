import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:8000";

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Function to trigger a 'tick' from the agentic backend
  const processTick = async () => {
    try {
      console.log("Fetching from:", API_BASE);
      const res = await axios.post(`${API_BASE}/process-tick`);
      console.log("Response:", res.data);
      setTelemetry(res.data.telemetry);
      setCurrentFrame(res.data.frame);
      setLoading(false);
      
      if (res.data.is_alert) {
        setAlerts(prev => [{
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          msg: res.data.analysis
        }, ...prev].slice(0, 5)); // Keep last 5 alerts
      }
    } catch (err) {
      console.error("Backend error:", err.message);
      console.error("Full error:", err);
      setLoading(false);
    }
  };

  // 2. Poll the backend every 5 seconds
  useEffect(() => {
    processTick(); // Load immediately
    const interval = setInterval(processTick, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
      setSearchResults(res.data.results.documents[0] || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-6 font-mono">
      <header className="border-b-2 border-green-700 pb-4 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">DRONE_SEC_ANALYST_V1.0</h1>
        <div className="text-sm">
          <span className={`${loading ? 'animate-pulse' : ''} flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-400'}`}></div>
            {loading ? 'CONNECTING...' : 'LIVE_LINK_ACTIVE'}
          </span>
        </div>
      </header>

      <main className="grid grid-cols-3 gap-6">
        {/* Left: Telemetry */}
        <div className="col-span-2 space-y-4">
          <div className="border-2 border-green-700 p-4 bg-gray-800">
            <h2 className="text-lg mb-3 border-b border-green-700 pb-2">LIVE_TELEMETRY</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-green-700 bg-black">
                <p className="text-xs text-green-500">ALTITUDE</p>
                <p className="text-2xl">{telemetry?.altitude || "0.0"} M</p>
              </div>
              <div className="p-3 border border-green-700 bg-black">
                <p className="text-xs text-green-500">BATTERY</p>
                <p className="text-2xl">{telemetry?.battery || "0"}%</p>
              </div>
              <div className="p-3 border border-green-700 bg-black">
                <p className="text-xs text-green-500">LOCATION</p>
                <p className="text-sm">{telemetry?.position?.lat || "0.0"}, {telemetry?.position?.lng || "0.0"}</p>
              </div>
            </div>
          </div>

          <div className="border-2 border-green-700 p-4 bg-black h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-green-500 mb-2">[ VLM_DESCRIBER ]:</p>
              <p className="text-sm">{currentFrame?.description || "AWAITING_FEED..."}</p>
            </div>
          </div>
        </div>

        {/* Right: Alerts & Search */}
        <div className="space-y-4">
          <div className="border-2 border-green-700 p-4 bg-gray-800 h-48 overflow-y-auto">
            <h2 className="text-lg mb-2 border-b border-green-700 pb-2">THREAT_LOG</h2>
            {alerts.length === 0 ? (
              <p className="text-xs text-green-700 italic">NO_THREATS_DETECTED</p>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="text-xs mb-2 p-1 border-l border-red-900 bg-red-900/20">
                  <span className="text-red-400">[{a.time}]:</span> {a.msg}
                </div>
              ))
            )}
          </div>

          <div className="border-2 border-green-700 p-4 bg-gray-800">
            <h2 className="text-lg mb-2 border-b border-green-700 pb-2">SEARCH</h2>
            <div className="flex gap-2 mb-3">
              <input 
                className="bg-black border border-green-700 p-2 text-xs flex-1 text-green-400 focus:outline-none focus:border-green-400" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} className="bg-green-400 text-black px-3 text-xs font-bold">QUERY</button>
            </div>
            <div className="text-xs space-y-1">
              {searchResults.map((res, i) => (
                <div key={i} className="border-b border-green-700 pb-1">- {res}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;