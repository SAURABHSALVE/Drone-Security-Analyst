import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Activity, Search, AlertTriangle, Drone } from 'lucide-react';

const API_BASE = "http://localhost:8000";

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 1. Function to trigger a 'tick' from the agentic backend
  const processTick = async () => {
    try {
      const res = await axios.post(`${API_BASE}/process-tick`);
      setTelemetry(res.data.telemetry);
      setCurrentFrame(res.data.frame);
      
      if (res.data.is_alert) {
        setAlerts(prev => [{
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          msg: res.data.analysis
        }, ...prev].slice(0, 5)); // Keep last 5 alerts
      }
    } catch (err) {
      console.error("Backend offline", err);
    }
  };

  // 2. Poll the backend every 5 seconds
  useEffect(() => {
    const interval = setInterval(processTick, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
    setSearchResults(res.data.results.documents[0] || []);
  };

  return (
    <div className="min-h-screen bg-matrix-black text-matrix-green font-mono p-6">
      {/* Header */}
      <header className="border-b border-matrix-darkgreen pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-matrix-green" /> DRONE_SEC_ANALYST_V1.0
        </h1>
        <div className="flex gap-4 text-xs">
          <span className="animate-pulse flex items-center gap-1">
            <div className="w-2 h-2 bg-matrix-green rounded-full"></div> LIVE_LINK_ACTIVE
          </span>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-6 mt-6">
        {/* Left: Telemetry & Video Feed */}
        <div className="col-span-8 space-y-6">
          <section className="border border-matrix-darkgreen p-4 bg-matrix-darkgreen/10">
            <h2 className="text-sm mb-4 border-b border-matrix-darkgreen flex items-center gap-2">
              <Activity size={16}/> LIVE_TELEMETRY
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-2 border border-matrix-darkgreen bg-black">
                <p className="text-[10px] text-matrix-lightgreen">ALTITUDE</p>
                <p className="text-xl">{telemetry?.altitude || "0.0"} M</p>
              </div>
              <div className="p-2 border border-matrix-darkgreen bg-black">
                <p className="text-[10px] text-matrix-lightgreen">BATTERY</p>
                <p className="text-xl">{telemetry?.battery || "0"}%</p>
              </div>
              <div className="p-2 border border-matrix-darkgreen bg-black">
                <p className="text-[10px] text-matrix-lightgreen">LOCATION</p>
                <p className="text-[10px]">{telemetry?.position.lat}, {telemetry?.position.lng}</p>
              </div>
            </div>
          </section>

          <section className="border border-matrix-darkgreen p-4 bg-black h-64 flex flex-col justify-end">
             <div className="flex-1 flex items-center justify-center text-matrix-darkgreen">
                <Drone size={64} className="animate-bounce" />
             </div>
             <div className="bg-matrix-darkgreen/20 p-2 text-sm border-l-2 border-matrix-green">
               <p className="text-xs text-matrix-lightgreen font-bold">[ VLM_DESCRIBER ]:</p>
               {currentFrame?.description || "AWAITING_FEED..."}
             </div>
          </section>
        </div>

        {/* Right: Alerts & Search */}
        <div className="col-span-4 space-y-6">
          <section className="border border-matrix-darkgreen p-4 h-64 overflow-y-auto">
            <h2 className="text-sm border-b border-matrix-darkgreen mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> THREAT_LOG
            </h2>
            {alerts.length === 0 ? (
              <p className="text-xs text-matrix-darkgreen italic mt-4">NO_THREATS_DETECTED</p>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="text-[10px] mb-2 p-1 border-l border-red-900 bg-red-900/10">
                  <span className="text-red-500">[{a.time}] ALERT:</span> {a.msg}
                </div>
              ))
            )}
          </section>

          <section className="border border-matrix-darkgreen p-4">
            <h2 className="text-sm border-b border-matrix-darkgreen mb-4 flex items-center gap-2">
              <Search size={16}/> CROSS_DOMAIN_INDEX
            </h2>
            <div className="flex gap-2 mb-4">
              <input 
                className="bg-black border border-matrix-darkgreen p-1 text-xs w-full focus:outline-none focus:border-matrix-green" 
                placeholder="Search object (e.g. truck)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} className="bg-matrix-green text-matrix-black px-2 text-xs font-bold">QUERY</button>
            </div>
            <div className="text-[10px] space-y-2">
              {searchResults.map((res, i) => (
                <div key={i} className="border-b border-matrix-darkgreen pb-1 italic">
                  - {res}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;