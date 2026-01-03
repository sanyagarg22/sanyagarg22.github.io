interface IconProps {
  className?: string;
}

export function RectangleIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
