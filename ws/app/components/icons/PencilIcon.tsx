interface IconProps {
  className?: string;
}

export function PencilIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
            fill="#d69e2e" stroke="#2d3748" strokeWidth="1"/>
      <rect x="15" y="1" width="4" height="4" rx="2" fill="#ed64a6"/>
      <circle cx="19" cy="3" r="1" fill="#2d3748"/>
    </svg>
  );
}
