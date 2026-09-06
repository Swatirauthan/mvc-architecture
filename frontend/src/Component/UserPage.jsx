import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const UserPage = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [users, setUsers] = useState([]);

    async function loadUsers() {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
            throw new Error(data.error || "Failed to load users");
        }

        setUsers(data);
    }

    async function loadCourses() {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
            throw new Error(data.error || "Failed to load courses");
        }

        setCourses(data);
    }

    useEffect(() => {
        loadCourses().catch((error) => {
            console.error("Error loading courses:", error);
        });

        loadUsers().catch((error) => {
            console.error("Error loading users:", error);
        });
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("Delete this user?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${userId}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (response.ok) {
                await loadUsers();
            } else {
                alert(data.error || "Could not delete user");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to backend");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedCourse) {
            alert("Please select a course");
            return;
        }

        const userData = {
            name: name,
            email: email,
            courseId: Number(selectedCourse),
        };

        console.log("Sending data:", userData);

        try {
            const response = await fetch(
                "http://localhost:5000/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                await loadUsers();

                alert("User registered successfully!");

                setName("");
                setEmail("");
                setSelectedCourse("");
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

                <p className="subtitle">
                    Enter your details and pick one course you want to join.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* NAME */}
                    <div className="field">
                        <label htmlFor="name">Name</label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* COURSES */}
                    <div className="courses">

                        <h3>Select Course</h3>

                        <div className="course-list">

                            {courses.map((course) => (

                                <label
                                    key={course.id}
                                    className="course"
                                >

                                    <input
                                        type="radio"
                                        name="course"
                                        value={course.id}
                                        checked={
                                            selectedCourse === String(course.id)
                                        }
                                        onChange={(event) => {
                                            setSelectedCourse(event.target.value);
                                        }}
                                    />

                                    <span className="course-name">
                                        {course.name}
                                    </span>

                                    <span className="course-price">
                                        ₹{course.price}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>

                    {/* SUBMIT */}
                    <button
                        className="submit"
                        type="submit"
                    >
                        Submit Here
                    </button>

                    {/* TABLES */}
                    <div className="tables">

                        {/* USERS TABLE */}
                        <section className="table-block">

                            <h3>Users</h3>

                            <div className="table-wrap">

                                <table>

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Course</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.length === 0 ? (

                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="empty"
                                                >
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
                                                        {user.course_id ? (
                                                            <Link to={`/courses/${user.course_id}`}>
                                                                {user.course_name
                                                                    || "View course"}
                                                            </Link>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>


                        {/* COURSES TABLE */}
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
                                                <td
                                                    colSpan="3"
                                                    className="empty"
                                                >
                                                    No courses in the database yet.
                                                </td>
                                            </tr>

                                        ) : (

                                            courses.map((course) => (

                                                <tr key={course.id}>

                                                    <td>{course.id}</td>

                                                    <td>
                                                        <Link to={`/courses/${course.id}`}>
                                                            {course.name}
                                                        </Link>
                                                    </td>

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
    )
}

export default UserPage;