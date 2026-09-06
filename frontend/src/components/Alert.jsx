export function Alert({ type = "info", children, onClose }) {
  if (!children) {
    return null;
  }

  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      <p>{children}</p>
      {onClose ? (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      ) : null}
    </div>
  );
}
