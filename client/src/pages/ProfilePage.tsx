// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { getTelegramUserId } from '../utils/getTelegramUser';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface ConnectedWallet {
  id: number;
  type: string;
  address: string;
  isConnected: boolean;
}

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([
    // Mock data - replace with actual wallet connections
    {
      id: 1,
      type: 'MetaMask',
      address: '0x1234...5678',
      isConnected: true
    },
    {
      id: 2,
      type: 'WalletConnect',
      address: '0xabcd...efgh',
      isConnected: false
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      const telegramId = getTelegramUserId();
      if (telegramId) {
        // Create user data from available info
        setUserData({
          id: parseInt(telegramId),
          first_name: 'User', // You can get this from your user store or API
          last_name: '',
          username: `user_${telegramId}`,
        });
      }
    }
  }, [isOpen]);

  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  const handleConnectWallet = (walletId: number): void => {
    setConnectedWallets(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, isConnected: !wallet.isConnected }
          : wallet
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {userData?.photo_url ? (
                <img 
                  src={userData.photo_url} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {getInitials(userData?.first_name, userData?.last_name)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-white text-lg font-medium">
                {userData?.first_name} {userData?.last_name}
              </h3>
              <p className="text-gray-400 text-sm">
                @{userData?.username || 'No username'}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Telegram ID</p>
            <p className="text-white font-mono text-sm">{userData?.id || 'Loading...'}</p>
          </div>
        </div>

        {/* Connected Wallets */}
        <div className="p-6 border-b border-gray-700">
          <h4 className="text-white text-lg font-medium mb-4">Connected Wallets</h4>
          <div className="space-y-3">
            {connectedWallets.map((wallet) => (
              <div key={wallet.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{wallet.type}</p>
                      <p className="text-gray-400 text-xs">{wallet.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnectWallet(wallet.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      wallet.isConnected
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {wallet.isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors">
            + Add New Wallet
          </button>
        </div>

        {/* Settings/Actions */}
        <div className="p-6">
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white">Settings</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white">Help & Support</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};