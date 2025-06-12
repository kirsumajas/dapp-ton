// src/components/WithdrawButton.tsx
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';

export default function WithdrawButton({ amount }: { amount: number }) {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();

  const handleWithdraw = async () => {
    if (!userAddress) {
      alert('Please connect wallet first.');
      return;
    }

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: 'EQ...YOUR_TREASURY_ADDRESS...', // This is where you want to send tokens from (could be a vault contract or null)
            amount: toNano(amount).toString(),
            payload: '', // You can attach a comment or payload if needed
          },
        ],
      });

      alert('Transaction sent!');
    } catch (err) {
      console.error('Transaction error:', err);
      alert('Transaction failed or rejected');
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded-md"
      onClick={handleWithdraw}
    >
      Withdraw {amount} TON
    </button>
  );
}
