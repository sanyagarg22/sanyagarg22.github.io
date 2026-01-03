interface IconProps {
  className?: string;
}

export function SaveIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
            stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="7" y="13" width="10" height="8" rx="1" fill="#3182ce" stroke="#2c5282" strokeWidth="1"/>
      <rect x="7" y="3" width="8" height="5" fill="#e2e8f0" stroke="#2d3748" strokeWidth="1"/>
    </svg>
  );
}
