import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../App.css";

function getUsersFromResponse(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.users)) {
        return data.users;
    }

    return [];
}

const CoursePage = () => {
    const { courseId } = useParams();

    const [users, setUsers] = useState([]);
    const [course, setCourse] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function loadCourseUsers() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `http://localhost:5000/api/courses/${courseId}/users`
                );

                const data = await response.json();

                if (ignore) {
                    return;
                }

                if (!response.ok) {
                    setCourse(null);
                    setUsers([]);
                    setError(data.error || "Could not load course");
                    return;
                }

                const userList = getUsersFromResponse(data);
                const courseInfo = data.course || (
                    userList[0]
                        ? {
                            id: userList[0].course_id,
                            name: userList[0].course_name,
                        }
                        : null
                );

                setCourse(courseInfo);
                setUsers(userList);
            } catch (loadError) {
                console.error("Error loading course users:", loadError);

                if (ignore) {
                    return;
                }

                setCourse(null);
                setUsers([]);
                setError("Could not connect to backend");
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadCourseUsers();

        return () => {
            ignore = true;
        };
    }, [courseId]);

    return (
        <div className="page">
            <div className="card">

                <p className="eyebrow">
                    <Link to="/">Back to users</Link>
                </p>

                <h1>
                    {course ? course.name : "Course Details"}
                </h1>

                <p className="subtitle">
                    {error || "Users enrolled in this course"}
                </p>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="empty">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="empty">
                                        {error
                                            ? "—"
                                            : "No users enrolled in this course."}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default CoursePage;
