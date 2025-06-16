import { SVGProps } from "react";

export default function TasksIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
      {...props}
    >
      <path
        d="M17.32 1.367H7.012c-3.592 0-5.844 2.544-5.844 6.143v9.714c0 3.6 2.241 6.143 5.844 6.143H17.32c3.605 0 5.848-2.544 5.848-6.143V7.51c0-3.6-2.243-6.143-5.846-6.143"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipRule="evenodd"
      />
      <path
        d="m7.933 12.367 2.823 2.822 5.643-5.644"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
    </svg>
  );
}
