import axios from 'axios';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import './App.css';
import Register from './pages/Register';
import SalonExplorer from './pages/SalonExplorer';
import NavBar from './components/NavBar';
import SalonRegistration from './pages/SalonRegistration';


import { useEffect, useState } from 'react';
import Salons from './pages/Salons';

function App() {
  const [msg, setMsg] = useState('');
  const [issaName, setIssaName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/ping')
      .then(res => setMsg(res.data.message))
      .catch(err => console.log(err));
    
       axios.get('http://localhost:5000/api/issa')
      .then(res => setIssaName(res.data.message))
      .catch(err => console.log(err));
    
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lhoussaine" element={<h1>arssekal lhoussaine</h1>} />
        <Route path="/test" element={<h1>{msg}</h1>} />
        <Route path="/smitissa" element={<h1 className="text-2xl font-bold ml-2">{issaName}</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/salons" element={<SalonExplorer/>} />
        <Route path="/salonstest" element={<Salons/>} />
        <Route path="/proposer-salon" element={<SalonRegistration/>} />
      </Routes>
    </Router>
  );
}

export default App;
