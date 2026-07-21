import express from "express"
import authRoutes from "./routes/auth.route.js"
import profileRoutes from "./routes/profile.route.js"
import taskRoutes from "./routes/task.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import config from "./config/config.js"

const app = express()

const allowedOrigins = [
  config.FRONTEND_URL,
  "http://localhost:4173",
  "https://to-do-list-frontend-inky-pi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is live now."
    });
});


app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/task", taskRoutes)





export  default app;
