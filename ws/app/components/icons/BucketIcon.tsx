interface IconProps {
  className?: string;
}

export function BucketIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11H5a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2z"
            fill="#3182ce" stroke="#2c5282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 11V7a3 3 0 016 0v4"
            stroke="#d69e2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="16" y="8" width="3" height="1" fill="#d69e2e"/>
    </svg>
  );
}
