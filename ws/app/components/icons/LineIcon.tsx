interface IconProps {
  className?: string;
}

export function LineIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="17" r="2" fill="currentColor"/>
      <circle cx="17" cy="7" r="2" fill="currentColor"/>
    </svg>
  );
}
