import '../styles/dashboard.css'
import {Link, useLocation} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.jsx";
import {useEffect, useState} from "react";

export default function Dashboard() {
    const location = useLocation();
    const user = location.state?.user?.user;
    const [courses, setCourses] = useState([]);
    localStorage.setItem("email", user.email);

    const userEmail = localStorage.getItem("email");

    const [courseList, setCourseList] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openSemester, setOpenSemester] = useState(null);

    useEffect(() => {
        getCourses().then();
    }, [setCourses]);

    async function getCourses() {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/getCourses");
            if (response.status === 200) {
                console.log("Courses fetched successfully:", response.data);
                setCourseList(response.data.courses);
            } else {
                setCourseList([]);
            }
        } catch (error) {
            setCourseList([]);
        } finally {
            setLoading(false);
        }
    }

    async function updateCourse(e) {
        e.preventDefault();
        const courseId = e.target.value;
        const email = localStorage.getItem("email");
        console.log("Updating course to:", {email, courseId});
        try {
            const response = await axiosInstance.post("/setCourse", {
                email: email,
                course_id: courseId
            });
            if (response.status === 200) {
                console.log("Course updated successfully:", response.data);
                // Handle a successful course update, e.g., show a success message
                window.location.reload();
            } else {
                console.error("Failed to update course:", response.data);
            }
        } catch (error) {
            console.error("Error updating course:", error);
        }
    }



    useEffect(() => {
        getCourseModules().then();
    }, []);

    async function getCourseModules(){
        try {
            const response = await axiosInstance.post("/getCoursesByEmail", { email: userEmail });
            if (!response.status) {
                new Error('Network response was not ok');
            }
            console.log('Course modules fetched successfully:', response.data);
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching course modules:', error);
            return [];
        }
    }

    return (
        <div className="dashboard">

            <h1>Dashboard</h1>
            <div>
                <strong>Welcome, {user?.username}</strong>
            </div>
            <div>
                <br/>
                <div className="courses" >
                    {loading ? (<p>Loading...</p>) : courseList.length > 0 ? (
                        <select onChange={(e) => updateCourse(e)}>
                            <option>Select Course</option>
                            {courseList.map((course, index) => (
                                <option key={index} value={course.course_id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    ) : (<p>No courses available.</p>)}
                    <button ><Link to="/register">Register Course</Link></button>
                    <br/>
                </div>
                {courses.length > 0 ? (
                    <ul>
                        {courses.map((course, index) => (
                            <li key={index}>
                                <h2>{course.title}</h2>
                                {course.modules?.map((moduleList, i) => (
                                    <div key={i} className="semester-dropdown">
                                        <div
                                            className="semester-header"
                                            onClick={() =>
                                                setOpenSemester(
                                                    openSemester === `${index}-${i}` ? null : `${index}-${i}`
                                                )
                                            }
                                            style={{ cursor: "pointer", userSelect: "none" }}
                                        >
                                            <h3>
                                                Semester {i + 1}{" "}
                                                <span>
                                                {/*{openSemester === `${index}-${i}` ? "▲" : "▼"}*/}
                                            </span>
                                            </h3>
                                        </div>
                                        {openSemester === `${index}-${i}` && (
                                            <div className="modules-grid">
                                                {Array.isArray(moduleList)
                                                    ? moduleList.map((mod, j) => (
                                                        <div className="module-item" key={j}>
                                                            {mod}
                                                        </div>
                                                    ))
                                                    : <div className="module-item">{moduleList}</div>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses available.</p>
                )}
            </div>
        </div>
    );
}