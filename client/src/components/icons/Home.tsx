import { SVGProps } from "react";

export default function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
      {...props}
    >
      <path
        d="M1.245 15.434c0-6.626.72-6.164 4.601-9.77 1.698-1.37 4.34-4.013 6.621-4.013 2.28 0 4.975 2.63 6.688 4.013 3.88 3.606 4.6 3.144 4.6 9.77 0 9.75-2.3 9.75-11.255 9.75s-11.255 0-11.255-9.75"
        stroke="currentColor"
        strokeWidth={1.53}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipRule="evenodd"
      />
    </svg>
  );
}

