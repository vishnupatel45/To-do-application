import './App.css';
import React from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Dashboard from './TotoApplication/dashboard';
import Login from './TotoApplication/login';
import Register from './TotoApplication/register';

function App() {
  return (
    <div className="App overflow-hidden">
      <div className="App-Blur">
      <BrowserRouter>
        <header className="App-header">
          <h1 className='text-center text-secondary'>To Do App</h1>
        </header>
        <div className="Routes">
          <Routes>
            <Route path="/" element={<Dashboard/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
