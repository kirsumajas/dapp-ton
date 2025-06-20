import { useState } from 'react';
import { useWalletStore } from '../../store/walletStore';
import { requestWithdraw } from '../../api/withdraw';

export default function WithdrawForm() {
  const { address } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!address || !amount) {
      setStatus('Missing wallet or amount');
      return;
    }

    const result = await requestWithdraw(address, amount);
    if (result.success) {
      setStatus('✅ Withdraw request sent!');
    } else {
      setStatus(`❌ Error: ${result.error || result.message}`);
    }
  };

  return (
    <div className="p-4 bg-[#2e2c33] rounded-xl text-white max-w-sm mx-auto">
      <h3 className="text-lg font-bold mb-2">Withdraw CHOP</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mb-2 px-3 py-2 rounded bg-[#3a3840] text-white"
      />
      <button
        onClick={handleWithdraw}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        Send
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
