import { useState } from 'react';

interface MilestoneCardProps {
  title: string;
  description: string;
}

export default function MilestoneCard({ title, description }: MilestoneCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`
        bg-[#2e2c33] border border-black rounded-md cursor-pointer
        w-full px-0 py-3 overflow-hidden transition-all duration-300
        ${open ? 'h-[160px]' : 'h-[54px]'}
      `}
    >
      {/* Header (always visible) */}
      <div className="flex justify-between items-center px-5">
        <h3 className="text-[#bab5b5] text-lg font-bold">{title}</h3>
        <span
          className={`transform transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▲
        </span>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="mt-4 text-sm text-white/80 px-5">
          {description}
        </div>
      )}
    </div>
  );
}
