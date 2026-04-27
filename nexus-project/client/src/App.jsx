import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard'; // Assuming you added this in Phase 5!
import axios from 'axios';

// This checks if you are in production or local development automatically
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  // Use state to track the token dynamically
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        {/* Pass setToken to Auth so it can update the App state on login */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Auth setToken={setToken} />} />
        
        {/* Pass setToken to Dashboard so it can clear the state on logout */}
        <Route path="/dashboard" element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/" />} />
        
        {/* Kanban Board Route */}
        <Route path="/project/:projectId" element={token ? <KanbanBoard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;