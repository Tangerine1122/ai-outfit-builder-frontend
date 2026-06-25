import { useState, useEffect } from "react";

// This is the address where your FastAPI server is running locally.
// Later, when you deploy this app for real, this will need to change
// to your server's real address -- for now, local testing only.
const API_URL = "http://localhost:8000";

function App() {
  // React state: a variable that, when changed, automatically makes
  // React re-render the screen with the new value.
  const [healthStatus, setHealthStatus] = useState("Checking connection...");

  // useEffect runs code automatically when the component first appears
  // on screen -- this is where we make our first request to FastAPI.
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((response) => response.json())
      .then((data) => {
        setHealthStatus(`Connected! Backend says: "${data.status}"`);
      })
      .catch((error) => {
        setHealthStatus(`Connection failed: ${error.message}`);
      });
  }, []); // empty array = only run this once, when the page first loads

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>DEE'S WARDROBE</h1>
      <p>Frontend-to-backend connection test</p>
      <p>{healthStatus}</p>
    </div>
  );
}

export default App;