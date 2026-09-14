export function LogoScroller() {
  const chunk = "PARTYHBG · ";
  const line = chunk.repeat(12);

  return (
    <div className="logo-scroller" aria-hidden="true">
      <div className="logo-scroller-track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
