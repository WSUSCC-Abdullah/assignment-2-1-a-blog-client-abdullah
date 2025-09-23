export function SummaryItem({
  name,
  count,
  isSelected,
  title,
}: {
  name: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <div
      title={title}
      style={{
        background: isSelected ? "#e0e0e0" : "transparent",
        color: isSelected ? "#222" : "#555",
        fontWeight: isSelected ? "bold" : "normal",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        textDecoration: "none",
        marginBottom: "0.25rem",
        cursor: "pointer",
      }}
    >
      <span>{name}</span>
      <span style={{ opacity: 0.7 }}>{count}</span>
    </div>
  );
}