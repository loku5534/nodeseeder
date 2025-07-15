import {Login, SignUp, Dashboard, Register} from "../pages/index.js";

export const routes = [
    {
        path: "/", element: <Dashboard/>,

    },
    {
        path: "/login", element: <Login/>

    },
    {
        path: "/register", element: <Register/>

    },
    {
        path: "/register", element: <SignUp/>

    }
];