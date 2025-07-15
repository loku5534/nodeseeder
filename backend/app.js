const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const userRouter = require('./src/routers/user.js').default;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get("/", (req, res) =>
    res.send("hello, world")
);

app.use('/', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});