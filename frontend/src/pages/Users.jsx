import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/useAuth";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { TextField } from "../components/TextField";

const emptyForm = { name: "", email: "", courseIds: [] };

function validateForm(form) {
  const errors = {};

  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "Enter a name with at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function Users({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const [nextUsers, nextCourses] = await Promise.all([api.getUsers(), api.getCourses()]);
      setUsers(nextUsers);
      setCourses(nextCourses);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api
      .getUsers()
      .then((nextUsers) => {
        setUsers(nextUsers);
        return api.getCourses();
      })
      .then((nextCourses) => {
        setCourses(nextCourses);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function toggleCourse(courseId) {
    setForm((current) => {
      const exists = current.courseIds.includes(courseId);
      return {
        ...current,
        courseIds: exists
          ? current.courseIds.filter((id) => id !== courseId)
          : [...current.courseIds, courseId],
      };
    });
  }

  function startEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      courseIds: (user.courses || []).map((course) => Number(course.id)),
    });
    setErrors({});
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (editingId && !isAuthenticated) {
      setError("Sign in first. Updating a user calls PUT /api/users/:id, which uses auth middleware.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        courseIds: form.courseIds,
      };

      if (editingId) {
        await api.updateUser(editingId, payload);
        setMessage("User updated through PUT /api/users/:id.");
      } else {
        await api.createUser(payload);
        setMessage("User created through POST /api/users.");
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!isAuthenticated) {
      setError("Sign in first. Deleting a user calls DELETE /api/users/:id, which uses auth middleware.");
      return;
    }

    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await api.deleteUser(id);
      setMessage("User deleted through DELETE /api/users/:id.");
      if (editingId === id) {
        resetForm();
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <PageHeader
        eyebrow="CRUD · Users"
        title="Users"
        description="Create a user and enroll them in courses. This is the original registration flow, now sitting next to list / update / delete."
      />

      <Alert type="success" onClose={() => setMessage("")}>
        {message}
      </Alert>
      <Alert type="error" onClose={() => setError("")}>
        {error}
      </Alert>

      <div className="split">
        <Card
          title={editingId ? "Edit user" : "Create user"}
          subtitle={
            editingId
              ? "PUT /api/users/:id · requires authentication"
              : "POST /api/users · public, same contract as before"
          }
        >
          <form className="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(name) => setForm((current) => ({ ...current, name }))}
              placeholder="Ada Lovelace"
              error={errors.name}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(email) => setForm((current) => ({ ...current, email }))}
              placeholder="ada@example.com"
              error={errors.email}
              required
            />

            <fieldset className="fieldset">
              <legend>Courses</legend>
              <p className="field-hint">Optional. Stored in the user_courses join table.</p>
              {courses.length === 0 ? (
                <p className="muted">No courses yet. Add some on the Courses page.</p>
              ) : (
                courses.map((course) => (
                  <label key={course.id} className="check-row">
                    <input
                      type="checkbox"
                      checked={form.courseIds.includes(Number(course.id))}
                      onChange={() => toggleCourse(Number(course.id))}
                    />
                    <span>
                      {course.name} — ₹{course.price}
                    </span>
                  </label>
                ))
              )}
            </fieldset>

            <div className="btn-row">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Register user"}
              </Button>
              {editingId ? (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card title="All users" subtitle="GET /api/users">
          {loading ? (
            <p className="muted">Loading users…</p>
          ) : users.length === 0 ? (
            <p className="muted">No users yet. Submit the form to create the first one.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Courses</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {(user.courses || []).length === 0
                          ? "—"
                          : user.courses.map((course) => course.name).join(", ")}
                      </td>
                      <td className="row-actions">
                        <button type="button" className="text-btn" onClick={() => startEdit(user)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-btn danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isAuthenticated ? (
            <p className="field-hint">
              Edit and delete need a token.{" "}
              <button type="button" className="text-btn" onClick={() => onNavigate("auth")}>
                Sign in
              </button>
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
