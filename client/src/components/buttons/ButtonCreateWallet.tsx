import type { SVGProps } from 'react';

interface ButtonProps extends SVGProps<SVGSVGElement> {
  onClick?: () => void;
}

const ButtonCreateWallet = ({ onClick, ...props }: ButtonProps) => (
  <div onClick={onClick} className="cursor-pointer select-none inline-block">
    <svg
      viewBox="0 0 127 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Create Wallet Button"
      {...props}
    >
      <rect
        x={0.5}
        y={0.5}
        width={126}
        height={45}
        rx={11.5}
        fill="#555"
        fillOpacity={0.3}
      />
      <rect
        x={0.5}
        y={0.5}
        width={126}
        height={45}
        rx={11.5}
        stroke="#E2E2E2"
      />
      <text
        x="50%"
        y="50%"
        fill="#E2E2E2"
        fontSize="14"
        fontFamily="AktivGrotesk, system-ui, sans-serif"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="0.02em"
      >
        Connect Wallet
      </text>
    </svg>
  </div>
);

export default ButtonCreateWallet;
