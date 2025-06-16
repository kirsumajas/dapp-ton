import React from 'react';

const SvgButtonClaimAirdrop: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={210}
      height={46}
      viewBox="0 0 210 46"
      {...props}
    >
      <rect
        x={0.5}
        y={0.5}
        width={209}
        height={45}
        rx={11.5}
        fill="#555"
        fillOpacity={0.3}
      />
      <rect
        x={0.5}
        y={0.5}
        width={209}
        height={45}
        rx={11.5}
        stroke="#31AD36"
      />
      <path
        fill="#31AD36"
        d="M57.296 24.71a4.7 4.7 0 0 1-.378 1.414q-... (truncated for brevity) ..."
      />
    </svg>
  );
};

export default SvgButtonClaimAirdrop;

