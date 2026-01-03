interface IconProps {
  className?: string;
}

export function EraserIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" fill="#38a169"/>
      <circle cx="8" cy="8" r="1.5" fill="#2d3748"/>
      <circle cx="12" cy="8" r="1.5" fill="#2d3748"/>
      <circle cx="16" cy="8" r="1.5" fill="#2d3748"/>
      <circle cx="8" cy="12" r="1.5" fill="#2d3748"/>
      <circle cx="12" cy="12" r="1.5" fill="#2d3748"/>
      <circle cx="16" cy="12" r="1.5" fill="#2d3748"/>
      <circle cx="8" cy="16" r="1.5" fill="#2d3748"/>
      <circle cx="12" cy="16" r="1.5" fill="#2d3748"/>
      <circle cx="16" cy="16" r="1.5" fill="#2d3748"/>
    </svg>
  );
}
