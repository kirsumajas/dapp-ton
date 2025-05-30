import { SVGProps } from "react";

export default function CollectionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
      {...props}
    >
      <path
        d="M25.113 17.368c0 4.404-2.595 6.999-7 6.999H8.532c-4.415 0-7.01-2.595-7.01-7V7.775c0-4.404 1.617-7 6.021-7h2.46c.884 0 1.717.417 2.247 1.124l1.124 1.494a2.82 2.82 0 0 0 2.247 1.124h3.482c4.415 0 6.044 2.247 6.044 6.74z"
        stroke="currentColor"
        strokeWidth={1.535}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipRule="evenodd"
      />
      <path
        d="M7.407 15.806h11.808"
        stroke="currentColor"
        strokeWidth={1.535}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
    </svg>
  );
}
