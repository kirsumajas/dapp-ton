import React, { useEffect, useState } from 'react';
import ButtonClaimAirdrop from '../buttons/ButtonClaimAirdrop';
import { useAirdropStore } from '../../store/airdropStore';

const AirdropFrame: React.FC = () => {
  const airdropEnd = useAirdropStore((s) => s.airdropEnd);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = Date.now();
      const distance = airdropEnd - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimeLeft(); // run immediately on mount
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [airdropEnd]);

  const gradientTextStyle: React.CSSProperties = {
    background:
      'linear-gradient(90deg, #70E95B 0%, rgba(230,230,230,0.78) 16%, #4CA255 40%, #3DBE4A 61%, #E6E6E6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const handleClaim = () => {
    alert('Claim 100 CHOP clicked!');
  };

  return (
    <div className="bg-[#2e2c33] rounded-xl p-5 text-white w-full max-w-sm mx-auto">
      <div className="w-full bg-[#3a393f] rounded-xl p-4 pb-6 relative">
        <div className="text-center font-bold text-[20px] mb-4">
          EARLY BIRD AIRDROP
        </div>

        <div
          className="text-center text-[28px] font-extrabold leading-none tracking-wide"
          style={gradientTextStyle}
        >
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>

        <div
          className="mt-6 relative w-[210px] h-[46px] mx-auto cursor-pointer rounded-xl overflow-hidden"
          onClick={handleClaim}
        >
          <ButtonClaimAirdrop className="absolute top-0 left-0 w-full h-full" />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl flex items-center justify-center rounded-xl border border-[#31AD36]">
            <span className="text-[#31AD36] text-sm font-semibold">
              Claim <span className="font-bold">100 CHOP</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropFrame;
