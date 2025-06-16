import { SVGProps } from "react";

export default function WalletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 27 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
      {...props}
    >
      <path
        d="M25.278 15.05h-4.983a3.315 3.315 0 0 1-3.313-3.313 3.314 3.314 0 0 1 3.313-3.312h4.983M20.859 11.661h-.384"
        stroke="currentColor"
        strokeWidth={1.535}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.18 1.024H18.82a6.46 6.46 0 0 1 6.459 6.459v8.833a6.46 6.46 0 0 1-6.46 6.459H8.182a6.46 6.46 0 0 1-6.459-6.46V7.484a6.46 6.46 0 0 1 6.459-6.46"
        stroke="currentColor"
        strokeWidth={1.535}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipRule="evenodd"
      />
      <path
        d="M7.304 6.61h6.645"
        stroke="currentColor"
        strokeWidth={1.535}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
    </svg>
  );
}
