import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/useAuth";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { TextField } from "../components/TextField";

function validateAuth(form, mode) {
  const errors = {};

  if (mode === "register" && (!form.name.trim() || form.name.trim().length < 2)) {
    errors.name = "Enter a name with at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.password || (mode === "register" && form.password.length < 6)) {
    errors.password = mode === "register" ? "Use at least 6 characters." : "Password is required.";
  }

  return errors;
}

export function Auth() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateAuth(form, mode);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      };
      const result = mode === "register" ? await api.register(payload) : await api.login(payload);
      signIn(result.user, result.token);
      setMessage(result.message);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Authentication"
        title="Register and login"
        description="These forms call POST /api/auth/register and POST /api/auth/login. The JWT is stored in localStorage and sent as Authorization: Bearer on later requests."
      />

      <Alert type="success" onClose={() => setMessage("")}>
        {message}
      </Alert>
      <Alert type="error" onClose={() => setError("")}>
        {error}
      </Alert>

      <div className="split">
        <Card
          title={mode === "register" ? "Create an account" : "Sign in"}
          subtitle={mode === "register" ? "POST /api/auth/register" : "POST /api/auth/login"}
        >
          <div className="segmented" role="tablist">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <TextField
                label="Name"
                value={form.name}
                onChange={(name) => setForm((current) => ({ ...current, name }))}
                placeholder="Ada Lovelace"
                error={errors.name}
                required
              />
            ) : null}
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(email) => setForm((current) => ({ ...current, email }))}
              placeholder="ada@example.com"
              error={errors.email}
              autoComplete="email"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(password) => setForm((current) => ({ ...current, password }))}
              placeholder="At least 6 characters"
              error={errors.password}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              required
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Please wait..." : mode === "register" ? "Register" : "Sign in"}
            </Button>
          </form>
        </Card>

        <Card title="Current session" subtitle="GET /api/auth/me after the token is stored">
          {isAuthenticated ? (
            <div className="stack-sm">
              <p>
                Signed in as <strong>{user.name || user.email}</strong>
              </p>
              <p className="muted">
                Protected writes (create/update/delete courses, update/delete users) now include your
                token automatically.
              </p>
              <Button variant="secondary" onClick={signOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <p className="muted">
              You are not signed in. You can still list users and courses, and you can still use the
              public POST /api/users registration form.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
