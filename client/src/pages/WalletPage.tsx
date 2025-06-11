import ConnectWalletButton from '../components/ConnectWalletButton';
import JettonStats from '../components/JettonStats';
import PageLayout from '../components/PageLayout';
import logo from '../assets/Logo.svg';

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
    </PageLayout>
  );
}
