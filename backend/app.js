import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoAggregate from './src/services/mongoAggregate.js';
import userRouter from './src/routers/user.js';

dotenv.config();

const app = express();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("hello, world"));
app.use('/', userRouter);

await mongoAggregate.testAggregations();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});