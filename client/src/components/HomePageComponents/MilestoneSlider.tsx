import React from 'react';
import { motion } from 'framer-motion';

interface MilestoneSliderProps {
  milestones: { label: string }[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const MilestoneSlider: React.FC<MilestoneSliderProps> = ({ milestones, activeIndex, onChange }) => {
  return (
    <div className="flex overflow-x-auto gap-4 px-3 py-4 snap-x scroll-x-no-bar">
      {milestones.map((m, i) => (
        <motion.div
          key={i}
          className={`min-w-[240px] snap-center rounded-xl p-4 ${
            i === activeIndex ? 'bg-[#37353a]' : 'bg-[#2e2c33]'
          }`}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(i)}
        >
          <h4 className="text-white text-md font-bold mb-2">Season {i + 1}</h4>
          <p className="text-sm text-white/70">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MilestoneSlider;
