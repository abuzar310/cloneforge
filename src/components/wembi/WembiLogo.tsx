export function WembiLogo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/wembi/logo.svg"
      alt="Wembi"
      className={className}
      style={{ width: "min(42vw, 280px)", height: "auto" }}
    />
  );
}
