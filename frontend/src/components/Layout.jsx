import { useAuth } from "../context/useAuth";

const LINKS = [
  { id: "home", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "courses", label: "Courses" },
  { id: "auth", label: "Authentication" },
  { id: "architecture", label: "Architecture" },
  { id: "api", label: "API Explorer" },
];

export function Layout({ page, onNavigate, children }) {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => onNavigate("home")}>
          <span className="brand-mark">API</span>
          Users & Courses
        </button>

        <nav className="nav" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className={page === link.id ? "nav-link active" : "nav-link"}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="session">
          {isAuthenticated ? (
            <>
              <span className="session-name">{user.name || user.email}</span>
              <button type="button" className="text-btn" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <button type="button" className="text-btn" onClick={() => onNavigate("auth")}>
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="content">{children}</main>
    </div>
  );
}
