// src/components/SeasonGoals.tsx
import { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

type Goal = { id: number; title: string };

const initialGoals: Goal[] = [
  { id: 1, title: 'Launch App & get 5 coins' },
  { id: 2, title: 'Listing' },
  { id: 3, title: 'NFT collection' },
  { id: 4, title: 'Proof of stake contract' },
];

export default function SeasonGoals() {
  const [left, setLeft] = useState<Goal[]>(initialGoals);
  const [right, setRight] = useState<Goal[]>([]);

  const moveToRight = (goal: Goal) => {
    setLeft((l) => l.filter((g) => g.id !== goal.id));
    setRight((r) => [...r, goal]);
  };

  const moveToLeft = (goal: Goal) => {
    setRight((r) => r.filter((g) => g.id !== goal.id));
    setLeft((l) => [...l, goal]);
  };

  // tweak these to match your card height + gap
  const CARD_SPACING = 16;   // px between cards
  const CARD_HEIGHT = 60;    // px card height
  const STACK_HEIGHT = initialGoals.length * (CARD_HEIGHT + CARD_SPACING);

  return (
    <LayoutGroup>
      <div className="flex flex-col space-y-6 p-4">
        {/* 👆 24px gap between stacks */}

        {/* — Pending Stack — */}
        <div
          className="relative w-full"
          style={{ height: STACK_HEIGHT }}
        >
          {left.map((goal, i) => (
            <motion.div
              key={goal.id}
              layoutId={`goal-${goal.id}`}
              onClick={() => moveToRight(goal)}
              whileHover={{ scale: 1.02 }}
              className="absolute left-0 right-0 bg-white rounded-lg shadow p-4 cursor-pointer text-black"
              style={{
                top: i * CARD_SPACING,
                zIndex: left.length - i,
                height: CARD_HEIGHT,
              }}
            >
              {goal.title}
            </motion.div>
          ))}
        </div>

        {/* — Completed Stack — */}
        <div
          className="relative w-full"
          style={{ height: STACK_HEIGHT }}
        >
          {right.map((goal, i) => (
            <motion.div
              key={goal.id}
              layoutId={`goal-${goal.id}`}
              onClick={() => moveToLeft(goal)}
              whileHover={{ scale: 1.02 }}
              className="absolute left-0 right-0 bg-white rounded-lg shadow p-4 cursor-pointer text-black"
              style={{
                top: i * CARD_SPACING,
                zIndex: right.length - i,
                height: CARD_HEIGHT,
              }}
            >
              {goal.title}
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}

