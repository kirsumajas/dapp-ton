import PageLayout from '../components/PageLayout';
import logo from '../assets/Logo.svg';
import ButtonCreateWallet from '../components/buttons/ButtonCreateWallet';
import TelegramUserId from '../components/TelegramUserId';
import SvgClaimChop from '../components/buttons2/ClaimChop'; // ✅ your SVG button



export default function Collection() {
  const images = [
    '/dapp/assets/nfts/nft1.png',
    // Add more image paths as needed
  ];

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

        {/* Main Content */}
        <div className="px-4 pt-safe-top pb-safe-bottom max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">CHEKHOVSKY CHOPPA</h1>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`NFT ${index + 1}`}
                className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>

          {/* ✅ SvgClaimChop Button */}
          <div className="flex justify-center mt-8">
            <button onClick={() => alert('Claim CHOP clicked')}>
              <SvgClaimChop className="w-[210px] h-[46px] hover:opacity-80 transition" />
            </button>
          </div>
        </div>

        <TelegramUserId />
      </PageLayout>
   
  );
}
