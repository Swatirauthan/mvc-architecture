export function Badge({ method, children }) {
  const label = children || method;
  const tone = (method || label || "get").toLowerCase();

  return <span className={`badge badge-${tone}`}>{label}</span>;
}
