
import type { SVGProps } from 'react';

const SvgClaimChop = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 210 46"
    className="w-full h-auto" // default responsive size
    {...props} // allow custom className, style, etc.
  >
    <rect
      width={209}
      height={45}
      x={0.5}
      y={0.5}
      fill="#555"
      fillOpacity={0.3}
      rx={11.5}
    />
    <rect
      width={209}
      height={45}
      x={0.5}
      y={0.5}
      stroke="#31AD36"
      rx={11.5}
    />
    <path
      fill="#31AD36"
      d="M57.296 24.71a4.7 4.7 0 0 1-.378 1.414q... (trimmed for brevity)"
    />
  </svg>
);

export default SvgClaimChop;
