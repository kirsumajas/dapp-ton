import { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  DotProps,
  LabelProps,
} from 'recharts';

interface MilestonePoint {
  season: string;
  safety: number;
  label?: string;
  description?: string;
  details?: string;
}

const allMilestones: MilestonePoint[] = [
  { season: 'S0', safety: 0, label: 'Start', description: 'Project announcement & setup', details: 'We initiate the ChopCoin journey with foundational setup and vision.' },
  { season: 'S1', safety: 10, label: 'VC Funding', description: 'Secure strategic investors', details: 'We onboard early investors and secure seed capital for growth.' },
  { season: 'S2', safety: 30, label: 'DEX Listing', description: 'Token becomes tradable', details: 'The token is launched on a decentralized exchange with incentives.' },
  { season: 'S3', safety: 60, label: 'Market Maker', description: 'Liquidity incentives', details: 'We partner with market makers to boost liquidity and confidence.' },
  { season: 'S4', safety: 85, label: 'CEX Listing', description: 'Mainstream exposure', details: 'A major listing on centralized exchange brings mass user adoption.' },
];

interface GrowingGraphProps {
  onScrollLockChange?: (shouldLock: boolean) => void;
}

export default function GrowingGraph({ onScrollLockChange }: GrowingGraphProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardHeight = 220; 
  const isScrolling = useRef(false);
  const startY = useRef<number | null>(null);
  const isAtEnd = currentIndex === allMilestones.length - 1;

  // Notify parent about scroll lock status
  useEffect(() => {
    onScrollLockChange?.(!isAtEnd);
  }, [isAtEnd, onScrollLockChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (startY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - startY.current;
    if (Math.abs(deltaY) > 40) {
      const direction = deltaY > 0 ? -1 : 1;
      const newIndex = Math.max(0, Math.min(allMilestones.length - 1, currentIndex + direction));
      setCurrentIndex(newIndex);
    }
    startY.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    
    if (isAtEnd) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (isScrolling.current) return;
    isScrolling.current = true;

    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(allMilestones.length - 1, currentIndex + direction));
    setCurrentIndex(newIndex);

    setTimeout(() => {
      isScrolling.current = false;
    }, 400);
  };

  const CustomDot = ({ cx, cy }: DotProps) => {
    if (typeof cx !== 'number' || typeof cy !== 'number') return null;
    return <circle cx={cx} cy={cy} r={6} fill="white" stroke="#8f88ff" strokeWidth={2} />;
  };

  const MilestoneLabel = ({ x, y, index }: LabelProps) => {
    if (typeof x !== 'number' || typeof y !== 'number' || index === undefined) return null;
    const label = allMilestones[index]?.label;
    return (
      <text x={x} y={y - 8} fill="#8f88ff" textAnchor="middle" fontSize={10} fontWeight="bold">
        {label}
      </text>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Graph Section */}
      <div className="rounded-xl pl-2 pr-8" style={{ backgroundColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={allMilestones.slice(0, currentIndex + 1)}
            margin={{ top: 20, right: 30, bottom: 50, left: 5 }}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey="season"
              type="category"
              axisLine={{ stroke: 'white', strokeWidth: 2 }}
              tickLine={{ stroke: 'white', strokeWidth: 1 }}
              tick={{ fill: 'white', fontSize: 14, fontWeight: 'bold' }}
              interval={0}
              padding={{ left: 15, right: 15 }}
              allowDuplicatedCategory={false}
              domain={allMilestones.map(m => m.season)}
              height={20}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={{ stroke: 'white', strokeWidth: 2 }}
              tickLine={{ stroke: 'white', strokeWidth: 1 }}
              tick={{ fill: 'white', fontSize: 10 }}
              width={25}
            />
            <Line
              type="monotone"
              dataKey="safety"
              stroke="#8f88ff"
              strokeWidth={3}
              isAnimationActive={true}
              animationDuration={600}
              dot={<CustomDot />}
              label={<MilestoneLabel />}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Custom Axis Arrows */}
        <div className="relative -mt-12">
          {/* X-axis arrow */}
          <div className="absolute bottom-4 right-8">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M14 1L19 6L14 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 6H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* Y-axis arrow */}
          <div className="absolute -top-8 left-3">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M1 6L6 1L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 19V1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Cards Section with more spacing */}
      <div className="card-scroll-lock py-2">
        <div
          className="relative h-[240px] overflow-hidden rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <div
            className="transition-transform duration-500 ease-in-out space-y-4 pr-2"
            style={{
              transform: `translateY(-${currentIndex * cardHeight}px)`,
              height: `${allMilestones.length * cardHeight}px`,
            }}
          >
            {allMilestones.map((milestone, index) => (
              <div
                key={milestone.season}
                className={`h-[200px] p-4 rounded-lg transition-all duration-300 flex flex-col justify-between border ${
                  index === currentIndex 
                    ? 'text-white scale-100 bg-gray-800/50 border-[#8f88ff]/30 shadow-lg' 
                    : 'text-white/70 bg-gray-800/20 border-gray-700/30'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{milestone.label}</h3>
                    <span className="text-xs px-2 py-1 bg-[#8f88ff]/20 rounded-full text-[#8f88ff]">
                      {milestone.season}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{milestone.description}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{milestone.details}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">Safety Score</div>
                  <div className="text-sm font-bold text-[#8f88ff]">{milestone.safety}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

         {/* Enhanced Progress indicator - More prominent */}
      <div className="flex flex-col items-center space-y-4 py-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">
            Milestone {currentIndex + 1} of {allMilestones.length}
          </p>
          <div className="flex justify-center space-x-3">
            {allMilestones.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#8f88ff] scale-125 shadow-lg shadow-[#8f88ff]/50' 
                    : index < currentIndex 
                      ? 'bg-[#8f88ff]/60' 
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
        
        {/* Swipe hint */}
        {!isAtEnd && (
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs">
              👆 Swipe or scroll to explore milestones
            </p>
          </div>
        )}
      </div>

      {/* End indicator with more space */}
      {isAtEnd && (
        <div className="text-center py-6 space-y-3">
          <div className="text-2xl">🎉</div>
          <p className="text-gray-400 text-sm">
            All milestones revealed!
          </p>
          <p className="text-gray-500 text-xs">
            Scroll down for more content
          </p>
        </div>
      )}

      {/* Additional bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}