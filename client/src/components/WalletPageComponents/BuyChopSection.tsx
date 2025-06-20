// src/components/BuyChopSection.tsx
import React, { useState } from 'react';
import SlideUpPopup from '../SlideUpPopup';

const BuyChopSection: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const dexes = [
    {
      name: 'TON Rocket',
      url: 'https://tonrocket.com/swap/CHOP',
    },
    {
      name: 'STON.fi',
      url: 'https://app.ston.fi/swap?token0=TON&token1=CHOP',
    },
    {
      name: 'DeDust',
      url: 'https://dedust.io/swap/CHOP',
    },
  ];

  return (
    <div className="px-4 mt-4">
      <button
        onClick={() => setPopupOpen(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-md"
      >
        🛒 Buy CHOP
      </button>

      <SlideUpPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} title="Buy CHOP on DEX">
        <div className="space-y-3">
          {dexes.map((dex) => (
            <a
              key={dex.name}
              href={dex.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-[#2f2f35] hover:bg-[#3a3a42] transition text-center text-white font-medium"
            >
              {dex.name}
            </a>
          ))}
        </div>
      </SlideUpPopup>
    </div>
  );
};

export default BuyChopSection;
