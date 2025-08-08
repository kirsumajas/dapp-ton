// ProfileButton.tsx
import React, { useState, useEffect } from 'react';
import { getTelegramUserId } from '../utils/getTelegramUser';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface ProfileButtonProps {
  onProfileClick: () => void;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ onProfileClick }) => {
  const [userData, setUserData] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Since getTelegramUserData doesn't exist, we'll create user data from available info
    const telegramId = getTelegramUserId();
    if (telegramId) {
      // You can extend this when you have more user data available
      setUserData({
        id: parseInt(telegramId),
        first_name: 'User', // Default or get from your user store
        last_name: '',
        username: `user_${telegramId}`,
      });
    }
  }, []);

  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  return (
    <button
      onClick={onProfileClick}
      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      {userData?.photo_url ? (
        <img 
          src={userData.photo_url} 
          alt="Profile" 
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-white font-semibold text-sm">
          {getInitials(userData?.first_name, userData?.last_name)}
        </span>
      )}
    </button>
  );
};