import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/index'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />} />
      </Routes>
    </div>
  );
}

export default App;
