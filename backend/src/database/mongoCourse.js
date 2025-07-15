import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class MongoCourse {
    static instance;

    constructor() {
        if (MongoCourse.instance) {
            return MongoCourse.instance;
        }
        this.connection = mongoose.createConnection(process.env.MONGODB_URI_1, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.connection.on('connected', () => {
            console.log('MongoCourse connected');
        });
        this.connection.on('error', (err) => {
            console.error('MongoCourse connection error:', err);
        });
        this.connection.on('disconnected', () => {
            console.log('MongoCourse disconnected');
        });

        MongoCourse.instance = this;
    }

    getConnection() {
        return this.connection;
    }
}

export default new MongoCourse();