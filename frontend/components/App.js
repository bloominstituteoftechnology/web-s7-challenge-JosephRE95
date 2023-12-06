import React from 'react';
import { BrowserRouter as  Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Form from './Form';


function App() {
  return (
    
      <div id="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/order">Order</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Form />} />
        </Routes>
      </div>
    
  );
}

export default App;

