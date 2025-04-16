import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Headphones } from 'lucide-react';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(40);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';

  useEffect(() => {
    // Generate random 6-digit OTP
    const randomOtp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    setOtp(randomOtp);
    
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => !digit)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    navigate('/home', { state: { phoneNumber } });
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] p-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <button className="flex items-center gap-2 text-white">
          <Headphones size={24} />
          <span>Support</span>
        </button>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Enter 6 digit OTP</h1>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            SMS sent to : +91 {phoneNumber}
          </p>
          <button className="text-purple-400">Change</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-white text-2xl bg-[#2d1b4e] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold"
          >
            Verify OTP & Login →
          </button>

          <button
            type="button"
            disabled={timer > 0}
            className="w-full py-4 text-gray-400 flex items-center justify-center gap-2"
          >
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Resend OTP ({timer}s)
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;