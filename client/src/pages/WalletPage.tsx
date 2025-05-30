import ConnectWalletButton from '../components/ConnectWalletButton';
import JettonStats from '../components/JettonStats';
import SeasonGoals from '../components/SeasonGoals';
import PageLayout from '../components/PageLayout';

const Logo = () => (
  <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">CHEKHOVSKY CHOPPA</h1>
);

export default function Wallet() {
  return (
    <PageLayout>
      <div className="px-4 pt-safe-top pb-safe-bottom max-w-4xl mx-auto space-y-10 text-center">
        <Logo />
        <div className="flex justify-center">
          <ConnectWalletButton />
        </div>
        <JettonStats />
        <section>
          <SeasonGoals />
        </section>
        <div className="text-gray-400 text-sm mt-6 space-y-2">
          <p>🌐 Links</p>
          <p>📜 Who we are</p>
        </div>
      </div>
    </PageLayout>
  );
}
