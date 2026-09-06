import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [users, setUsers] = useState([]);

  async function loadUsers() {
    const response = await fetch("http://localhost:5000/api/users");
    const data = await response.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  async function loadCourses() {
    const response = await fetch("http://localhost:5000/api/courses");
    const data = await response.json();
    setCourses(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadCourses().catch((error) => {
      console.error("Error loading courses:", error);
    });

    loadUsers().catch((error) => {
      console.error("Error loading users:", error);
    });
  }, []);

  const handleCourseChange = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      name: name,
      email: email,
      courseIds: selectedCourses,
    };

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        await loadUsers();
        alert("User registered successfully!");
        setName("");
        setEmail("");
        setSelectedCourses([]);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to backend");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>User Details</h1>
        <p className="subtitle">Enter your details and pick the courses you want to join.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="courses">
            <h3>Select Courses</h3>
            <div className="course-list">
              {courses.map((course) => (
                <label key={course.id} className="course">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(Number(course.id))}
                    onChange={() => handleCourseChange(Number(course.id))}
                  />
                  <span className="course-name">{course.name}</span>
                  <span className="course-price">₹{course.price}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="submit" type="submit">
            Submit Here
          </button>

          <div className="tables">
            <section className="table-block">
              <h3>Users</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Courses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty">
                          No users in the database yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {(user.courses || []).length === 0
                              ? "—"
                              : user.courses.map((course) => course.name).join(", ")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="table-block">
              <h3>Courses</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty">
                          No courses in the database yet.
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course.id}>
                          <td>{course.id}</td>
                          <td>{course.name}</td>
                          <td>₹{course.price}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
