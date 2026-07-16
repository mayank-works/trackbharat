// src/components/ui/TrainIcon.tsx

interface TrainIconProps {
  className?: string;
  size?: number;
}

export const TrainIcon = ({ className = '', size = 24 }: TrainIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Train body - sleek and modern */}
    <path
      d="M4 12L5 5H19L20 12M4 12H20M4 12V17H6V15H18V17H20V12M6 17V19H8V17H6M16 17V19H18V17H16M8 9H16V12H8V9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Front wheels */}
    <circle cx="7" cy="14" r="1.5" fill="currentColor" />
    <circle cx="17" cy="14" r="1.5" fill="currentColor" />
    
    {/* Subtle window glow */}
    <rect x="9" y="7" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
  </svg>
);