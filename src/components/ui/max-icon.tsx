interface MaxIconProps {
  size?: number;
  className?: string;
}

export default function MaxIcon({ size = 20, className = "" }: MaxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MAX"
    >
      <defs>
        <linearGradient id="maxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD60A" />
          <stop offset="100%" stopColor="#FF9500" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#maxGradient)" />
      <path
        d="M8.5 22V10h2.6l4.9 7.6L20.9 10h2.6v12h-2.5v-7.4l-4.4 6.8h-.2l-4.4-6.8V22H8.5z"
        fill="#0F172A"
      />
    </svg>
  );
}
