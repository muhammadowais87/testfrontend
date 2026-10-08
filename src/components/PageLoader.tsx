// Route-transition loader: the platform logo with a spinning ring. Inline SVG, no image
// request. Fades in after a short delay so fast navigations don't flash it.
const PageLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-screen items-center justify-center bg-background animate-loader-in"
  >
    <div className="relative h-16 w-16">
      <svg
        className="absolute inset-0 h-full w-full animate-spin text-primary motion-reduce:animate-none"
        style={{ animationDuration: "1s" }}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="29" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
        <path d="M32 3a29 29 0 0 1 29 29" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg
        className="absolute inset-[11px] h-[42px] w-[42px] animate-loader-pulse motion-reduce:animate-none"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="page-loader-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#page-loader-g)" />
        <path d="M18 48L31 16H33L46 48H40L37 40H27L24 48H18ZM29 35H35L32 26L29 35Z" fill="#ffffff" />
      </svg>
    </div>
    <span className="sr-only">Loading</span>
  </div>
);

export default PageLoader;
