import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SeasonTabs from '../components/SeasonTabs';
import OverlapWrapper from '../components/OverlapWrapper';
import logo from '../assets/Logo.svg';
import ButtonCreateWallet from '../components/buttons/ButtonCreateWallet';
import InfoCards from '../components/InfoCards';
import ProgressCard from '../components/ProgressCard';

export default function Home() {
  const [season, setSeason] = useState('Preseason');

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
        <ButtonCreateWallet className="w-[127px] h-[46px]" />
      </section>

      {/* Hero */}
      <section className="pb-6 px-2">
        <div className="w-full h-[400px] bg-[#26242A] rounded-xl flex items-center justify-center">
          <span className="text-lg text-white/50">Hero image here</span>
        </div>
      </section>

      {/* InfoCards */}
      <section className="px-0 pb-4">
        <h2 className="text-xl font-bold text-white mb-4 px-3">What is Chop Coin?</h2>
        <InfoCards />
      </section>

      {/* Milestones */}
      <section className="px-0 mb-10">
        <h2 className="text-xl font-bold text-white mb-4 px-3">Milestones</h2>
        <SeasonTabs activeSeason={season} onSelect={setSeason} />
        <OverlapWrapper season={season} />
      </section>
      <div className="h-[180px]"></div>
      {/* Season Goals */}
      <section className="px-0 mb-10">
        <h2 className="text-xl font-bold text-white mb-4 px-3">Season Goals</h2>
        <div className="px-3">
          <p className="text-white/70 text-sm mb-2">
            Season goals are a set of objectives that the Chekhovsky Choppa team aims to achieve in each season.
          </p>
          <ul className="list-disc pl-5 text-white/70 text-sm space-y-1">
            <li>Expand community engagement</li>
            <li>Increase token utility</li>
            <li>Launch new features</li>
          </ul>
        </div>
      </section>
      
      {/* Progress Bar*/}
      <section className="px-0 mb-10">
        <h2 className="text-xl font-bold text-white mb-4 px-3">Progress</h2>
          <ProgressCard season={season} />

      </section>
      
      <div className="h-[180px]"></div>
      {/* Footer */}
      <footer className="px-3 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="text-white/50 text-sm text-center">
          © 2024 Chekhovsky Choppa. All rights reserved.
        </div>
      </footer>


      {/* Scroll buffer to avoid nav overlap */}
      <div className="h-[80px]"></div>
    </PageLayout>
  );
}
