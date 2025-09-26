import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Ticket Platform</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>Welcome to Ticket Platform</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
