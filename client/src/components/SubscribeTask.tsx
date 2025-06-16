import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

const SubscribeTask = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'not_subscribed' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const userId = WebApp.initDataUnsafe?.user?.id;
  console.log('initDataUnsafe:', WebApp.initDataUnsafe);

  const handleCheckSubscription = async () => {
    if (!userId) {
      setStatus('error');
      setMessage('Unable to get Telegram user ID.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('https://dapp-ton-backend.onrender.com/check-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.subscribed) {
        setStatus('subscribed');
        setMessage('✅ You are subscribed!');
      } else {
        setStatus('not_subscribed');
        setMessage('❌ You are NOT subscribed.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('⚠️ Error checking subscription. Try again later.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">📢 Telegram Subscription Task</h2>

      <a
        href="https://t.me/chekhovskychoppa"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline block mb-4"
      >
        Open Telegram Channel
      </a>

      <button
        onClick={handleCheckSubscription}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Checking...' : '🔍 Check Subscription'}
      </button>

      {message && (
        <p className={`mt-4 font-medium ${status === 'subscribed' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      <p className="text-sm text-gray-500 mt-2">
  Detected Telegram User ID: {userId ?? 'None'}
     </p>
    </div>
  );
};

export default SubscribeTask;
