export interface OverlapWrapperProps {
  season: string;
}

export interface CardData {
  title: string;
  content: string;
}

export function getCardsForSeason(season: string): CardData[] {
  switch (season) {
    case 'Preseason':
      return [
        { title: 'Proof of Stake Contract', content: 'Deploy PoS contract on TON testnet.' },
        { title: 'NFT Collection', content: 'Design and mint Choppa NFTs.' },
        { title: 'Landing Page', content: 'Publish branded landing page.' },
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
      ];
    case '1 Season':
      return [
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
        { title: 'Airdrop Campaign', content: 'Launch CHOP token airdrop via Telegram.' },
        { title: 'Social Growth', content: 'Boost engagement with meme contests.' },
        { title: 'DEX Listing', content: 'List CHOP token on STON.fi and other DEXs.' },
      ];
    // Add more seasons as needed
    default:
      return [];
  }
}
