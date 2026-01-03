interface IconProps {
  className?: string;
}

export function CutIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 4L8.12 15.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14.47 14.48L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8.12 8.12L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
