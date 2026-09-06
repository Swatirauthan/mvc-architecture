export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="page-header">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="page-header-row">
        <div>
          <h1>{title}</h1>
          {description ? <p className="lede">{description}</p> : null}
        </div>
        {children}
      </div>
    </header>
  );
}
