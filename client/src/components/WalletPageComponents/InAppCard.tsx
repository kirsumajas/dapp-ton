import React from "react";

interface InAppCardProps {
  balance: number;
  onWithdraw?: () => void;
}

const InAppCard: React.FC<InAppCardProps> = ({ balance, onWithdraw }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="bg-[#2e2c33] rounded-[19px] shadow-md overflow-hidden w-[373px] h-[233px] relative">
        <div className="flex flex-col w-[189px] absolute top-[35px] left-[19px] text-white">
          <p className="opacity-45 text-sm">Balance (in-app)</p>
          <h1 className="text-[2.7rem] font-black leading-none">{balance}</h1>
        </div>

        <div className="absolute top-[154px] left-0 w-full flex justify-start px-6">
          <button
            onClick={onWithdraw}
            className="px-12 py-2.5 rounded-xl border border-text-light bg-[#5555554c] text-text-light text-sm font-medium backdrop-blur-md backdrop-brightness-100"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAppCard;
