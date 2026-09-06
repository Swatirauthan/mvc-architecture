import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/useAuth";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { TextField } from "../components/TextField";

const emptyForm = { name: "", description: "", price: "" };

function validateForm(form) {
  const errors = {};

  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "Enter a course name with at least 2 characters.";
  }

  if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = "Enter a price of 0 or greater.";
  }

  return errors;
}

export function Courses({ onNavigate }) {
  const { isAuthenticated } = useAuth();
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
      setCourses(await api.getCourses());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api
      .getCourses()
      .then((nextCourses) => {
        setCourses(nextCourses);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function startEdit(course) {
    setEditingId(course.id);
    setForm({
      name: course.name,
      description: course.description || "",
      price: String(course.price),
    });
    setErrors({});
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

    if (!isAuthenticated) {
      setError(
        "Sign in first. Creating or updating a course goes through auth middleware before the controller."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
      };

      if (editingId) {
        await api.updateCourse(editingId, payload);
        setMessage("Course updated through PUT /api/courses/:id.");
      } else {
        await api.createCourse(payload);
        setMessage("Course created through POST /api/courses.");
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
      setError("Sign in first. DELETE /api/courses/:id is protected.");
      return;
    }

    if (!window.confirm("Delete this course?")) {
      return;
    }

    try {
      await api.deleteCourse(id);
      setMessage("Course deleted through DELETE /api/courses/:id.");
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
        eyebrow="CRUD · Courses"
        title="Courses"
        description="The original app only listed courses. This page adds create, update, and delete so you can walk through a complete REST resource."
      />

      <Alert type="success" onClose={() => setMessage("")}>
        {message}
      </Alert>
      <Alert type="error" onClose={() => setError("")}>
        {error}
      </Alert>

      <div className="split">
        <Card
          title={editingId ? "Edit course" : "Create course"}
          subtitle={
            editingId
              ? "PUT /api/courses/:id · auth + validation"
              : "POST /api/courses · auth + validation → controller → service → model"
          }
        >
          <form className="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(name) => setForm((current) => ({ ...current, name }))}
              placeholder="React Fundamentals"
              error={errors.name}
              required
            />
            <TextField
              label="Description"
              type="textarea"
              value={form.description}
              onChange={(description) => setForm((current) => ({ ...current, description }))}
              placeholder="What does this course cover?"
              hint="Stored in the existing courses.description column."
            />
            <TextField
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={(price) => setForm((current) => ({ ...current, price }))}
              placeholder="4999"
              error={errors.price}
              hint="Matches the existing courses.price column."
              required
            />
            <div className="btn-row">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Create course"}
              </Button>
              {editingId ? (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
            {!isAuthenticated ? (
              <p className="field-hint">
                Writes are protected.{" "}
                <button type="button" className="text-btn" onClick={() => onNavigate("auth")}>
                  Create an account
                </button>
              </p>
            ) : null}
          </form>
        </Card>

        <Card title="All courses" subtitle="GET /api/courses">
          {loading ? (
            <p className="muted">Loading courses…</p>
          ) : courses.length === 0 ? (
            <p className="muted">No courses yet. Add one to use them on the Users page.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.name}</td>
                      <td>{course.description || "—"}</td>
                      <td>₹{course.price}</td>
                      <td className="row-actions">
                        <button type="button" className="text-btn" onClick={() => startEdit(course)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-btn danger"
                          onClick={() => handleDelete(course.id)}
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
        </Card>
      </div>
    </div>
  );
}
