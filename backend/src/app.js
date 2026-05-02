import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.routs.js";

//route declaration using middleware and here userRouterr is controller, here you dont need middlewware that's why this field is empty 
app.use("/api/v1/user", userRouter);

export default app;