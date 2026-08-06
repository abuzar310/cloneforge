export function SectionHead({
  index,
  title,
  light,
}: {
  index: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div
      className="w-s-head"
      style={{ color: light ? "var(--c-light)" : "var(--c-text)" }}
    >
      <span>n.{index}</span>
      <span className="w-s-head__title">{title}</span>
      <span>n.{index}</span>
    </div>
  );
}
