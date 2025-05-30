import PageLayout from '../components/PageLayout';

export default function Collection() {
  const images = [
    '/dapp/assets/nfts/nft1.png',
    // Add more image paths as needed
  ];

  return (
    <PageLayout>
      <div className="px-4 pt-safe-top pb-safe-bottom max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">CHEKHOVSKY CHOPPA</h1>
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
      </div>
    </PageLayout>
  );
}
