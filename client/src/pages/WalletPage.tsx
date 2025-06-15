import ConnectWalletButton from '../components/ConnectWalletButton';
import JettonStats from '../components/JettonStats';
import PageLayout from '../components/PageLayout';
import WithdrawForm from '../components/WithdrawForm';
import logo from '../assets/Logo.svg';
import WithdrawButton from '../components/WithdrawButton';
import InAppBalance from '../components/InAppBalance';

export default function Wallet() {
  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-[calc(env(safe-area-inset-top)+92px)] pb-4 px-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="ChopCoin Logo"
            className="w-[122px] h-[49px] object-contain"
          />
        </div>

        {/* Custom wallet connect button or address */}
        <ConnectWalletButton />
      </section>

      {/* Jetton statistics section */}
      <JettonStats />
      
      {/* In-app balance section */}
      <InAppBalance/>

      {/* Withdraw form */}
      <div className="mt-6 px-4">
        <WithdrawForm />
      </div>
      {/* Withdraw button section */}
      <div className="p-4">
      <h2 className="text-white text-lg mb-2">Withdraw your earnings</h2>
      <WithdrawButton amount={0.5} />
    </div>

    </PageLayout>
  );
}
