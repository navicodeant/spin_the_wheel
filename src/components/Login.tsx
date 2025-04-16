import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import axios from 'axios';
import type { LoginResponse } from '../types/auth';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post<LoginResponse>(
        'https://king777.xss.in.net/spinner/login.php',
        { mobile: phoneNumber }
      );

      if (response.data.status === 'success') {
        // Store auth data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/otp', { state: { phoneNumber } });
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] flex flex-col items-center p-4">
      <div className="w-32 h-32 rounded-full bg-[#2d1b4e] flex items-center justify-center mb-8 mt-16">
        <img
          src="https://ik.imagekit.io/spin12/spin-logo-removebg-preview.png"
          alt="Logo"
          className="w-24 h-24 object-contain"
        />
      </div>

      <div className="flex items-center gap-1 mb-4">
        <div className="flex">
          {[1,2,3,4,5].map((star, index) => (
            <span key={index} className="text-yellow-400 text-2xl">★</span>
          ))}
        </div>
        <span className="text-green-500 text-xl ml-2">4.3 Ratings</span>
      </div>

      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl text-white font-semibold">Enter 10 digit Mobile Number</h2>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <div className="flex items-center gap-1">
              <img
                src="https://flagcdn.com/w20/in.png"
                alt="India"
                className="w-5 h-4"
              />
              <span className="text-white">+91</span>
            </div>
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter mobile number"
            className="w-full pl-24 pr-4 py-4 bg-[#2d1b4e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={phoneNumber.length !== 10 || isLoading}
          className={`w-full py-4 rounded-lg text-white text-lg font-semibold mt-4 
            ${phoneNumber.length === 10 && !isLoading ? 'bg-green-500' : 'bg-gray-500'}`}
        >
          {isLoading ? 'Please wait...' : 'NEXT'}
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          By proceeding, you agree to SpinGame{' '}
          <a href="#" className="text-purple-400">Privacy Policy</a> and{' '}
          <a href="#" className="text-purple-400">Terms & Conditions</a>
        </p>
      </div>
    </div>
  );
};

export default Login;