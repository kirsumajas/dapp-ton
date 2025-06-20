import React from 'react';

interface StatsCardProps {
  price: number;
  liquidity: number;
  holders: number;
  circulating: number;
  onBuyClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  price,
  liquidity,
  holders,
  circulating,
  onBuyClick
}) => {
  return (
    <div className="bg-[#2e2c33] text-white p-4 rounded-2xl w-full max-w-md mx-auto shadow-md">
      <h2 className="text-lg font-semibold mb-4">📊 CHOP Stats</h2>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-400">Price</p>
          <p>{price} TON</p>
        </div>
        <div>
          <p className="text-gray-400">Liquidity</p>
          <p>{liquidity} TON</p>
        </div>
        <div>
          <p className="text-gray-400">Holders</p>
          <p>{holders}</p>
        </div>
        <div>
          <p className="text-gray-400">Circulating Supply</p>
          <p>{circulating} CHOP</p>
        </div>
      </div>
      <button
        onClick={onBuyClick}
        className="w-full h-11 rounded-xl border border-white bg-[#ffffff0a] text-white backdrop-blur-md hover:bg-white hover:text-black transition"
      >
        Buy CHOP
      </button>
    </div>
  );
};

export default StatsCard;
