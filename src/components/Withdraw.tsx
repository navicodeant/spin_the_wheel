import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, AlertCircle } from 'lucide-react';
import type { User } from '../types/auth';

const generateRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Withdraw = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paytmNumber, setPaytmNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(storedUser) as User;
    setUser(userData);
  }, [navigate]);

  const handlePaytmNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPaytmNumber(value);
      setError(null);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
    setError(null);
  };

  const handleWithdraw = async () => {
    if (!amount || !paytmNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (paytmNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const withdrawAmount = Number(amount);
    if (withdrawAmount < 500) {
      setError('Minimum withdrawal amount is ₹500');
      return;
    }

    if (user && withdrawAmount > user.wallet) {
      setError('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const tid = generateRandomString(20);
      const trid = generateRandomString(20);

      const response = await fetch('https://king777.xss.in.net/spinner/withdraw.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          mobile: user?.mobile,
          amount: withdrawAmount,
          upi_number: paytmNumber,
          trid,
          tid
        })
      });

      if (!response.ok) {
        throw new Error('Withdrawal request failed');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccess(data.message || 'Withdrawal request submitted successfully');
        setAmount('');
        setPaytmNumber('');
      } else {
        setError(data.message || 'Withdrawal request failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('Withdrawal request failed. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a0b2e] p-2">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl text-white">Withdraw</h1>
      </div>

      <div className="bg-[#2d1b4e] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="text-white" size={18} />
          <div>
            <h2 className="text-white text-sm">My Wallet</h2>
            <p className="text-gray-400 text-xs">Earned Amount</p>
          </div>
        </div>
        <p className="text-2xl text-white">₹{user.wallet}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-3 flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 mb-3 flex items-start gap-2">
          <AlertCircle className="text-green-500 shrink-0" size={18} />
          <p className="text-green-500 text-sm">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg p-4">
        <div className="flex gap-3 mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png"
            alt="Paytm"
            className="h-6 object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
            alt="UPI"
            className="h-6 object-contain"
          />
        </div>

        <div className="space-y-3">
          <input
            type="tel"
            value={paytmNumber}
            onChange={handlePaytmNumberChange}
            placeholder="Enter PayTm Number"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            maxLength={10}
          />
          <input
            type="tel"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter Amount"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
          <p className="text-xs text-gray-500">Minimum Withdraw Amount is ₹500</p>
        </div>

        <button 
          onClick={handleWithdraw}
          disabled={isProcessing || !amount || !paytmNumber || paytmNumber.length !== 10 || Number(amount) < 500 || Number(amount) > user.wallet}
          className={`w-full bg-[#2d1b4e] text-white py-3 rounded-lg text-lg mt-4 ${
            isProcessing || !amount || !paytmNumber || paytmNumber.length !== 10 || Number(amount) < 500 || Number(amount) > user.wallet
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isProcessing ? 'Processing...' : 'WITHDRAW'}
        </button>
      </div>
    </div>
  );
};

export default Withdraw;