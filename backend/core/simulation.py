import datetime
import random

class DroneSimulator:
    def __init__(self):
        self.gate_location = {"lat": 18.5204, "lng": 73.8567} # Example Aurangabad coords
    
    def generate_telemetry(self):
        """Simulates live drone telemetry data."""
        return {
            "timestamp": datetime.datetime.now().isoformat(),
            "altitude": round(random.uniform(10.0, 50.0), 2),
            "position": self.gate_location,
            "battery": random.randint(60, 95)
        }

    def generate_frame_description(self):
        """Simulates VLM output for a video frame[cite: 28]."""
        scenarios = [
            "Clear sky, no activity at main gate.",
            "Blue Ford F150 truck approaching the entrance.",
            "Person in a hoodie loitering near the perimeter fence.",
            "Delivery van dropping off a package at the front desk.",
            "Unknown individual attempting to open the side gate."
        ]
        return {
            "frame_id": random.randint(1000, 9999),
            "description": random.choice(scenarios),
            "timestamp": datetime.datetime.now().isoformat()
        }