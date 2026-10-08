// Route-transition loader: the Apex logo with a slim progress bar. The logo is a small
// (~11 KB) static image; the loader fades in after a short delay so fast navigations
// don't flash it. The logo image has a white background, so the loader is always white.
const PageLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white animate-loader-in"
  >
    <img
      src="/images/apex-loader.jpg"
      alt=""
      width={120}
      height={110}
      decoding="async"
      className="h-auto w-[120px] animate-loader-pulse motion-reduce:animate-none"
    />
    <div className="h-[3px] w-24 overflow-hidden rounded-full bg-primary/15" aria-hidden="true">
      <div className="h-full w-1/2 rounded-full bg-primary animate-loader-bar motion-reduce:animate-none" />
    </div>
    <span className="sr-only">Loading</span>
  </div>
);

export default PageLoader;
