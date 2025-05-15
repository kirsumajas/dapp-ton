import { useState } from 'react';
import clsx from 'clsx';

const goals = [
  {
    title: 'Early bird airdroop',
    description: 'Launch App AND get 5 coins for free',
    active: true,
  },
  {
    title: 'Listing',
    description: 'Get listed on top DEXs',
    active: true,
  },
  {
    title: 'NFT collection',
    description: 'Launch our Chekhovsky NFT collection',
  },
  {
    title: 'Proof of stake contract',
    description: 'Introduce staking to reward holders',
  },
];

export default function SeasonGoalsStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full max-w-md mx-auto mt-8 relative">
      {goals.map((goal, index) => {
        const isActive = index === activeIndex;
        const offset = isActive ? 0 : (index - activeIndex) * 40 + 60;

        return (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={clsx(
              'absolute left-0 right-0 mx-auto w-full transition-all duration-500 cursor-pointer',
              'rounded-xl shadow-md bg-gray-200 overflow-hidden',
              isActive ? 'z-10 scale-100' : 'z-0 scale-[0.98]'
            )}
            style={{ top: `${offset}px` }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{goal.title}</h3>
                {goal.active && (
                  <span className="w-3 h-3 bg-lime-400 rounded-full" />
                )}
              </div>
              {isActive && (
                <p className="mt-4 text-sm bg-black text-white py-2 px-4 rounded-md">
                  {goal.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

