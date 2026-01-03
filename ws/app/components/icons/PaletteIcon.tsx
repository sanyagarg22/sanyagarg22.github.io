interface IconProps {
  className?: string;
}

export function PaletteIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13.5" cy="6.5" r="2.5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r="2.5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r="2.5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r="2.5" fill="currentColor"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.56 0 3.05-.36 4.37-1L22 22l-2-3c-.26-.26-.53-.51-.81-.75C19.64 15.05 20 13.56 20 12c0-5.52-4.48-10-10-10z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
