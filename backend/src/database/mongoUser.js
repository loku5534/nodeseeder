import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class MongoUser {
    static instance;

    constructor() {
        if (MongoUser.instance) {
            return MongoUser.instance;
        }
        this.connection = mongoose.createConnection(process.env.MONGODB_URI_2 || "mongodb+srv://l227947:lqhBtZ93W8VO6InO@cluster0.fqh2q0i.mongodb.net/Users?retryWrites=true&w=majority&appName=Cluster0/", {
            useNewUrlParser: true, useUnifiedTopology: true,
        });
        this.connection.on('connected', () => {
            console.log('MongoUser connected');
        });
        this.connection.on('error', (err) => {
            console.error('MongoUser connection error:', err);
        });
        this.connection.on('disconnected', () => {
            console.log('MongoUser disconnected');
        });

        MongoUser.instance = this;
    }

    getConnection() {
        return this.connection;
    }
}

export default new MongoUser();