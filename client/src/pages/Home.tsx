import ConnectWalletButton from '../components/ConnectWalletButton';
import JettonStats from '../components/JettonStats';
/*import JettonStatsChart from '../components/JettonStatsChart';*/
import SeasonGoals from '../components/SeasonGoals';

const Logo = () => (
  <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">CHEKHOVSKY CHOPPA</h1>
);

export default function Home() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-10 text-center">
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
  );
}
