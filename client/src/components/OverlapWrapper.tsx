import { useEffect, useState } from 'react';
import type { OverlapWrapperProps, CardData } from './type';
import { getCardsForSeason } from './type';

export default function OverlapWrapper({ season }: OverlapWrapperProps) {
  const [visible, setVisible] = useState(true);
  const [activeSeason, setActiveSeason] = useState(season);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => {
      setActiveSeason(season);
      setVisible(true);
      setOpenIndex(null); // close all cards on season change
    }, 200);

    return () => clearTimeout(timeout);
  }, [season]);

  const cards: CardData[] = getCardsForSeason(activeSeason);

  const toggleCard = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div
      className={`transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-1">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ease-in-out overflow-hidden mx-[1%] bg-[#2e2c33] border border-black rounded-lg ${
              openIndex === index ? 'h-[160px]' : 'h-[54px]'
            }`}
          >
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => toggleCard(index)}
            >
              <span className="font-bold text-[#bab5b5] text-lg">{card.title}</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
            <div
              className={`px-5 pb-4 transition-opacity duration-300 ${
                openIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <p className="text-sm text-gray-300">{card.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
