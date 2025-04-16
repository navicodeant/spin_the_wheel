import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import { Wallet, RefreshCw } from 'lucide-react';
import type { User } from '../types/auth';

const data = [
  { option: '₹50', style: { backgroundColor: '#4caf50' } },
  { option: '-₹30', style: { backgroundColor: '#f44336' } },
  { option: '₹40', style: { backgroundColor: '#2196f3' } },
  { option: '-₹25', style: { backgroundColor: '#ff9800' } },
  { option: '₹60', style: { backgroundColor: '#4caf50' } },
  { option: '-₹35', style: { backgroundColor: '#f44336' } },
  { option: '₹45', style: { backgroundColor: '#2196f3' } },
  { option: '-₹20', style: { backgroundColor: '#ff9800' } },
];

const spinSound = new Audio('https://upcdn.io/kW2K8Kb/raw/spin_sound.mp3');
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3');

const Home = () => {
  const navigate = useNavigate();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUserData = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(storedUser) as User;
    setUser(userData);
    setTotalWinnings(userData.wallet);
  };

  useEffect(() => {
    loadUserData();
  }, [navigate]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      const response = await fetch('https://king777.xss.in.net/spinner/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: user.mobile
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh data');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setTotalWinnings(data.user.wallet);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculatePrizeNumber = () => {
    return Math.floor(Math.random() * data.length);
  };

  const updateSpinResult = async (spinAmount: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      const response = await fetch('https://king777.xss.in.net/spinner/play.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          mobile: user.mobile,
          spin: spinAmount.toString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update spin result');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        const updatedUser = {
          ...user,
          wallet: data.wallet,
          spinner_tries: data.spinner_tries
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setTotalWinnings(data.wallet);
      } else {
        throw new Error(data.message || 'Failed to update spin result');
      }
    } catch (error) {
      console.error('Error updating spin result:', error);
      setError('Failed to update spin result. Please try again.');
    }
  };

  const handleSpinClick = () => {
    if (isSpinning || !user) return;
    setShowWinModal(false);
    setError(null);

    if (user.spinner_tries > 0) {
      const newPrizeNumber = calculatePrizeNumber();
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setIsSpinning(true);
      spinSound.play();
    } else {
      document.getElementById('insufficient-modal')?.classList.remove('hidden');
    }
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);
    setIsSpinning(false);
    spinSound.pause();
    spinSound.currentTime = 0;
    winSound.play();
    
    const prizeText = data[prizeNumber].option;
    const prize = parseInt(prizeText.replace('₹', '').replace('-', ''));
    const isNegative = prizeText.includes('-');
    const finalPrize = isNegative ? -prize : prize;
    setCurrentPrize(finalPrize);
    
    await updateSpinResult(finalPrize);
    
    setShowWinModal(true);
  };

  const closeInsufficientModal = () => {
    document.getElementById('insufficient-modal')?.classList.add('hidden');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a0b2e] p-2 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img
            src="https://ik.imagekit.io/spin12/spin-logo-removebg-preview.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-white text-sm">+91 {user.mobile}</p>
            <p className="text-gray-400 text-xs">Profile &gt;</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`text-white p-1 rounded-full hover:bg-white/10 transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => navigate('/deposit')}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm"
          >
            <Wallet size={16} />
            <span>₹{totalWinnings}</span>
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="bg-[#2d1b4e] rounded-lg p-4 mb-4">
        <h2 className="text-xl text-white mb-4">Wallet Balance</h2>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-3xl text-white">{user.spinner_tries}</p>
            <p className="text-gray-400 text-sm">Spins</p>
          </div>
          <div className="text-center">
            <p className="text-3xl text-white">₹{totalWinnings}</p>
            <p className="text-gray-400 text-sm">Winnings</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate('/deposit')}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm"
          >
            Deposit
          </button>
          <button
            onClick={() => navigate('/withdraw')}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm"
          >
            Withdraw
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-3">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="flex justify-center mb-20">
          <div className="w-[280px] sm:w-[320px] md:w-[380px] mx-auto mr-10">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={handleStopSpinning}
              backgroundColors={['#2196f3', '#4caf50', '#f44336', '#ff9800']}
              textColors={['#ffffff']}
              outerBorderColor="#f9d423"
              outerBorderWidth={5}
              innerRadius={20}
              radiusLineColor="#f9d423"
              radiusLineWidth={2}
              spinDuration={0.8}
            />
          </div>
        </div>

        <button
          onClick={handleSpinClick}
          disabled={isSpinning}
          className={`w-full max-w-md bg-green-500 text-white py-3 rounded-lg text-lg font-bold absolute bottom-4 ${
            isSpinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
        </button>
      </div>

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2d1b4e] rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <img
                src="https://ik.imagekit.io/spin12/reward.png?updatedAt=1744316561943"
                alt="Reward"
                className="mx-auto mb-4 w-24 h-24 object-contain"
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentPrize >= 0 ? 'Congratulations! 🎉' : 'Better luck next time! 😔'}
              </h2>
              <p className={`text-4xl font-bold mb-4 ${currentPrize >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹{Math.abs(currentPrize)}
              </p>
              <p className="text-gray-400 mb-6">
                {currentPrize >= 0 ? 'Amount will be added to your winnings' : 'Amount will be deducted from your winnings'}
              </p>
              <button
                onClick={() => setShowWinModal(false)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl text-lg font-semibold transition-colors"
              >
                Spin More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Modal */}
      <div id="insufficient-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#2d1b4e] rounded-lg p-4 max-w-sm w-full">
          <div className="text-center">
            <img
              src="https://ik.imagekit.io/spin12/add_coins.png?updatedAt=1744316561597"
              alt="Insufficient funds"
              className="mx-auto mb-3 w-20 h-20 rounded-full"
            />
            <h3 className="text-lg font-bold text-white mb-2">Insufficient Spins!</h3>
            <p className="text-gray-400 mb-4 text-sm">
              You don't have enough Spins to spin the wheel. Add more Spins to continue playing!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/deposit')}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm"
              >
                Add Spins
              </button>
              <button
                onClick={closeInsufficientModal}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;