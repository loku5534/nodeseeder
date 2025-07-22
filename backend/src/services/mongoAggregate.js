import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import MongoUser from '../database/mongoUser.js';
import MongoCourse from '../database/mongoCourse.js';

// User model for aggregation
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    otp: Number,
    valid: Boolean,
    course_id: Number
}, { collection: 'users' });
const User = MongoUser.getConnection().model('User', userSchema);

// Course model for $lookup
const courseSchema = new mongoose.Schema({
    course_id: Number,
    name: String
}, { collection: 'courses' });
const Course = MongoCourse.getConnection().model('Course', courseSchema);

class mongoAggregate {
    static async testAggregations() {
        // 1. Most recurrent course_id among users
        const mostRecurrentCoursePipeline = [
            { $group: { _id: "$course_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ];
        const mostRecurrent = await User.aggregate(mostRecurrentCoursePipeline);
        console.log("Most recurrent course_id:", mostRecurrent);

        // 2. Most popular course with name (join with courses)
        const mostPopularCoursePipeline = [
            { $group: { _id: "$course_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
            { $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "course_id",
                as: "course_info"
            }},
            { $unwind: "$course_info" },
            { $project: { course_id: "$_id", count: 1, course_name: "$course_info.name" } }
        ];
        const mostPopularCourse = await User.aggregate(mostPopularCoursePipeline);
        console.log("Most popular course with name:", mostPopularCourse);

        // 3. Count of users per course, sorted by popularity, with course name
        const usersPerCoursePipeline = [
            { $group: { _id: "$course_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "course_id",
                as: "course_info"
            }},
            { $unwind: { path: "$course_info", preserveNullAndEmptyArrays: true } },
            { $project: { course_id: "$_id", count: 1, course_name: "$course_info.name" } }
        ];
        const usersPerCourse = await User.aggregate(usersPerCoursePipeline);
        console.log("Users per course:", usersPerCourse);
    }
}

export default mongoAggregate;

// // Run if called directly
// if (process.argv[1] && process.argv[1].endsWith('mongoAggregate.js')) {
//     (async () => {
//         await mongoAggregate.testAggregations();
//         process.exit(0);
//     })();
// }
