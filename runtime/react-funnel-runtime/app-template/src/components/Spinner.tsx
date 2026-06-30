export function Spinner({ label = "Loading" }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label} />;
}

export function LoadingOverlay({ active, label = "Loading" }: { active: boolean; label?: string }) {
  if (!active) return null;
  return (
    <div className="loading-overlay" role="status" aria-label={label} aria-live="polite">
      <div className="loading-overlay-box">
        <Spinner label={label} />
      </div>
    </div>
  );
}
