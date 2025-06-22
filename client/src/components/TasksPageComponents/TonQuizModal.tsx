// src/components/TonQuizModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TonQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const quiz = [
  {
    question: 'What does TON stand for?',
    options: ['Telegram Online Network', 'The Open Network', 'Token of Nations', 'Trusted Operations Network'],
    correctIndex: 1,
  },
  {
    question: 'What type of consensus mechanism does TON use?',
    options: ['Proof of Work', 'Delegated Proof of Stake', 'Proof of Stake', 'Byzantine Fault Tolerance'],
    correctIndex: 2,
  },
  {
    question: 'Which programming language is primarily used to write smart contracts on TON?',
    options: ['Solidity', 'Rust', 'FunC', 'Vyper'],
    correctIndex: 2,
  },
  {
    question: 'Which of the following is a feature of the TON blockchain?',
    options: ['Sharding for scalability', 'Built-in NFT minting', 'GPU mining support', 'Zero gas fees'],
    correctIndex: 0,
  },
];

const TonQuizModal: React.FC<TonQuizModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (index: number) => {
    if (index === quiz[step].correctIndex) {
      setScore((s) => s + 1);
    }
    const next = step + 1;
    if (next < quiz.length) {
      setStep(next);
    } else {
      setTimeout(() => {
        onComplete?.();
        onClose();
        alert(`You scored ${score + (index === quiz[step].correctIndex ? 1 : 0)} out of ${quiz.length}`);
        setStep(0);
        setScore(0);
      }, 400);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-[#1f1f23] rounded-t-2xl z-50 p-6 text-white"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">TON Quiz</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <h3 className="text-md font-semibold mb-4">{quiz[step].question}</h3>
            <div className="flex flex-col gap-2">
              {quiz[step].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="bg-[#2e2c33] hover:bg-[#3a3a40] text-white py-2 px-4 rounded-md border border-[#444]"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TonQuizModal;
