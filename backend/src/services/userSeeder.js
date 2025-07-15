import faker from 'faker';
import axios from 'axios';
import MongoUser from "../database/mongoUser.js";


const generateUsers = (numUsers, maxCourseId) => {
    return Array.from({ length: numUsers }, (_, i) => ({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        course: faker.datatype.number({ min: 1, max: maxCourseId })
    }));
};

const users = generateUsers(20, 10); // 50 users, course_id between 1 and 10

const sendUsers = async () => {
    for (const user of users) {
        try {
            console.log(user);
            const User = await MongoUser.getConnection();
            await User.collection('users').insertOne({
                username: user.username, email: user.email, password: user.password, otp: 12345, valid: true ,course_id: user.course
            });
        } catch (err) {
            console.error('Error registering user:', err.response?.data || err.message);
        }
    }
};

sendUsers().then(
    () => console.log("All users sent successfully"),
    (err) => console.error("Error sending users:", err)
);