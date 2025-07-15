// import MongoCourse from "../database/mongoCourse.js";
// import faker from 'faker';
// import mongoose from "mongoose";
//
// mongoose.set("strictQuery", true);
//
// const courseSchema = new mongoose.Schema({
//     title: {
//         type: String
//     },
//     modules: {
//         type: Array
//     }
// });
//
// const Course = MongoCourse.getConnection();
//
// const generateCourses = (numCourses, numModules) => {
//     const courses = [];
//     for (let i = 0; i < numCourses; i++) {
//         const modules = [];
//         for (let j = 0; j < numModules; j++) {
//             modules.push(faker.lorem.words());
//         }
//         courses.push({
//             title: "BS" + faker.lorem.words(),
//             modules: modules,
//             course_id: i + 1 // Assuming course_id starts from 1
//         });
//     }
//     return courses;
// };
//
// const user = generateCourses(2, 2);
//
// // Insert values within the Database
// Course.insertMany(user, function (err, docs) {
//     if (err) {
//         console.error("Error inserting courses:", err);
//     } else {
//         console.log("Courses seeded successfully:", docs);
//     }
// });

import faker from 'faker';
import axios from 'axios';
import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const courseSchema = new mongoose.Schema({
    title: {type: String}, modules: {type: [[String]]}, // Array of arrays of strings
    course_id: {type: Number}
});

const generateCourses = (numCourses, numSemesters, modulesPerSemester) => {
    return Array.from({ length: numCourses }, () => ({
        title: "BS " + faker.lorem.words(),
        modules: Array.from({ length: numSemesters }, () =>
            Array.from({ length: modulesPerSemester }, () => faker.lorem.words())
        )
    }));
};

const courses = generateCourses(50, 2, 2);

const sendCourses = async () => {
    for (const course of courses) {
        try {
            const res = await axios.post('http://localhost:3000/registerCourse', course);
            console.log('Course registered:', res.data);
        } catch (err) {
            console.error('Error registering course:', err.response?.data || err.message);
        }
    }
};

sendCourses().then(
    () => console.log("All courses sent successfully"),
    (err) => console.error("Error sending courses:", err)
);