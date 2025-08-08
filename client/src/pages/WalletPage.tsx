import  {useState} from 'react';
import PageLayout from '../components/PageLayout';
import AlertModal from '../components/AlertModal';
import TransactionHistory from '../components/WalletPageComponents/TransactionHistory';
import InAppBalance from '../components/WalletPageComponents/InAppBalance';
import { getTelegramUserId } from '../utils/getTelegramUser';
import { ProfileButton } from '../components/ProfileButton';
import { ProfilePage } from '../pages/ProfilePage';

export default function Wallet() {
  const [showAlert, setShowAlert] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleWithdraw = () => {
    console.log('Proceeding with withdrawal...');
    setShowAlert(false);
  };

  const telegramId = getTelegramUserId();

  if (!telegramId) {
    return <div className="text-white p-4">⚠️ Telegram ID not found.</div>;
  }

  return (
    <PageLayout>
      {/* Header with Profile Button */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-white text-xl font-semibold">Wallet</h1>
        <ProfileButton onProfileClick={() => setShowProfile(true)} />
      </div>

      {/* In-app balance card */}
      <InAppBalance />

      <TransactionHistory telegramId={telegramId} />

      <div className="h-[40px]"></div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Gas Fee Required"
        message="You need to pay a small gas fee to process the withdrawal transaction."
        confirmText="Proceed"
        onConfirm={handleWithdraw}
      />

      {/* Profile Modal */}
      <ProfilePage 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      <div className="h-[80px]"></div>
    </PageLayout>
  );
}