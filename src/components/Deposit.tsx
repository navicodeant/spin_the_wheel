import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, AlertCircle } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import type { User } from '../types/auth';

const generateRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Deposit = () => {
  const navigate = useNavigate();
  const { config, loading } = useConfig();
  const [selectedSpins, setSelectedSpins] = useState<number>(15);
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

  const spinPackages = [
    { spins: 5, price: 57 },
    { spins: 10, price: 105 },
    { spins: 15, price: 153 },
    { spins: 20, price: 203 },
    { spins: 30, price: 300 },
    { spins: 40, price: 404 },
  ];

  const handleSpinSelect = (spins: number) => {
    setSelectedSpins(spins);
    setError(null);
    setSuccess(null);
  };

  const handlePayment = async () => {
    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    const selectedPackage = spinPackages.find(pkg => pkg.spins === selectedSpins);
    if (!selectedPackage || !user) {
      setError('Invalid package selected');
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const tid = generateRandomString(20);
      const trid = generateRandomString(20);

      // Create UPI payment request
      const response = await fetch('https://king777.xss.in.net/spinner/upi_payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          mobile: user.mobile,
          amount: selectedPackage.price,
          trid,
          tid
        })
      });

      if (!response.ok) {
        throw new Error('Payment request failed');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        // Create UPI deep link
        const upiUrl = encodeURI(
          `upi://pay?pa=33460110028476@ucobank&pn=raja&mc=&tid=${tid}&tr=${trid}&tn=Add%20${selectedSpins}%20Spins&am=${selectedPackage.price}&cu=INR`
        );

        setSuccess(data.message);
        window.location.href = upiUrl;
      } else {
        setError(data.message || 'Payment request failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment request failed. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a0b2e] p-2">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg text-white">Add Cash</h1>
      </div>

      <div className="bg-[#2d1b4e] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="text-white" size={18} />
          <div>
            <h2 className="text-sm text-white">My Wallet</h2>
            <p className="text-xs text-gray-400">Balance</p>
          </div>
        </div>
        <p className="text-xl text-white">₹{user.wallet}</p>
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

      <h3 className="text-yellow-500 text-xs mb-2">RECHARGE OFFERS</h3>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {spinPackages.map((pkg) => (
          <div
            key={pkg.spins}
            className={`bg-[#2d1b4e] rounded-lg p-2 text-center cursor-pointer transition ${
              selectedSpins === pkg.spins ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => handleSpinSelect(pkg.spins)}
          >
            <p className="text-lg text-white">{pkg.spins}</p>
            <p className="text-xs text-white">Spins</p>
            <p className="text-xs text-green-500">₹{pkg.price}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full bg-green-500 text-white py-2 rounded-lg text-base mb-3 relative ${
          isProcessing ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? 'Processing...' : `Buy ${selectedSpins} Spins for ₹${spinPackages.find(pkg => pkg.spins === selectedSpins)?.price}`}
      </button>

      <div className="bg-[#2d1b4e] rounded-lg p-2 flex items-center gap-2">
        <div className="bg-green-500 rounded-full p-1">
          <Wallet className="text-white" size={14} />
        </div>
        <p className="text-white text-xs">
          SpinGame App is an excellent platform to gain money online by playing games fairly.
        </p>
      </div>
    </div>
  );
};

export default Deposit;