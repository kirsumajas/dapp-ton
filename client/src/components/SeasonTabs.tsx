

interface SeasonTabsProps {
  activeSeason: string;
  onSelect: (season: string) => void;
}

const seasons = ['Preseason', '1 Season', '2 Season', '3 Season', '4 Season'];

export default function SeasonTabs({ activeSeason, onSelect }: SeasonTabsProps) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-3 px-3 pb-4 w-max">
        {seasons.map((season) => (
          <button
            key={season}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
              ${
                activeSeason === season
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-white/30 text-white/60 hover:text-white'
              }`}
            onClick={() => onSelect(season)}
          >
            {season}
          </button>
        ))}
      </div>
    </div>
  );
}


