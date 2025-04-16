import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import Login from './components/Login';
import OtpVerification from './components/OtpVerification';
import Home from './components/Home';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <div className="min-h-screen bg-[#1a0b2e] flex justify-center">
          <div className="w-full max-w-md mx-auto">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/otp" element={<OtpVerification />} />
              <Route path="/home" element={<Home />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;