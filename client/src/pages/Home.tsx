import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SeasonTabs from '../components/HomePageComponents/SeasonTabs';
import OverlapWrapper from '../components/HomePageComponents/OverlapWrapper';
import logo from '../assets/Logo.svg';
import ProgressCard from '../components/HomePageComponents/ProgressCard';
import SeasonGoals from '../components/HomePageComponents/SeasonGoals';
import GrowingGraph from '../components/HomePageComponents/GrowingGraph';
import InfoCards from '../components/HomePageComponents/InfoCards';
import SlideUpPopup from '../components/SlideUpPopup';
import StatsCard from '../components/WalletPageComponents/JettonCard';
import ConnectWalletButton from '../components/ConnectWalletButton';

export default function Home() {
  const [season, setSeason] = useState('Preseason');
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  return (
    <PageLayout>
      <section className="pb-4 px-3 flex items-center justify-between">
        <img
          src={logo}
          alt="ChopCoin Logo"
          className="w-[122px] h-[49px] object-contain"
        />
        <ConnectWalletButton />
      </section>

      <section className="pb-6 px-2">
        <div className="w-full h-[400px] bg-[#26242A] rounded-xl flex items-center justify-center">
          <span className="text-lg text-white/50">Hero image here</span>
        </div>
      </section>

      <section className="px-0 pb-4">
        <h2 className="text-xl font-bold text-white mb-4 px-3">
          What is Chop Coin?
        </h2>
        <InfoCards onGraphCardClick={openPopup} />
      </section>

      <section className="px-0 mb-10">
        <ProgressCard season={season} />
      </section>

      <section className="px-0 mb-10">
        <h2 className="text-xl font-bold text-white mb-4 px-3">Milestones</h2>
        <SeasonTabs activeSeason={season} onSelect={setSeason} />
        <OverlapWrapper season={season} />
      </section>

      <section className="px-0 mb-10">
        <SeasonGoals season={season} />
      </section>

      <div className="h-[180px]"></div>

      <section className="px-0 mb-10">
        <StatsCard
        price={0.005}
        liquidity={12000}
        holders={734}
        circulating={870000000}
        onBuyClick={() => window.open('https://getgems.io/...', '_blank')}
      />
      </section>

      <footer className="px-3">
        <div className="text-white/50 text-sm text-center">
          © 2024 Chekhovsky Choppa. All rights reserved.
        </div>
      </footer>

      <div className="h-[80px]"></div>

      {/* Popup */}
      <SlideUpPopup isOpen={isPopupOpen} onClose={closePopup} title="Strategy Overview">
        <GrowingGraph />
      </SlideUpPopup>
    </PageLayout>
  );
}
