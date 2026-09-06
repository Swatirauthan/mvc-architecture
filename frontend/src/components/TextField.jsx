export function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  autoComplete,
}) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="field">
      <label htmlFor={fieldId}>
        {label}
        {required ? <span className="required"> *</span> : null}
      </label>
      {type === "textarea" ? (
        <textarea
          id={fieldId}
          value={value}
          placeholder={placeholder}
          rows={4}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? <p className="field-error">{error}</p> : null}
      {!error && hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}
