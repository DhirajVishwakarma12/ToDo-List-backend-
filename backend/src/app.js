import express from "express"
import authRoutes from "./routes/auth.route.js"
import profileRoutes from "./routes/profile.route.js"
import taskRoutes from "./routes/task.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import config from "./config/config.js"

const app = express()

const rawOrigins = [
  config.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "https://to-do-list-frontend-inky-pi.vercel.app"
];

// Clean up defined origins
const allowedOrigins = rawOrigins
  .filter(Boolean)
  .map(url => url.replace(/\/$/, ""));

// Regex to match Vercel production AND preview deployments
const vercelPattern = /^https:\/\/to-do-list-frontend.*\.vercel\.app$/;

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow non-browser requests (Postman, Render Health Checks)
    if (!origin) return callback(null, true);

    const sanitizedOrigin = origin.replace(/\/$/, "");

    // 2. Check exact matches or Vercel regex pattern
    const isAllowed = allowedOrigins.includes(sanitizedOrigin) || vercelPattern.test(sanitizedOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      // Printed directly in Render Logs tab
      console.warn(`[CORS Blocked on Render]: Incoming Origin "${origin}" not allowed.`);
      
      // Pass null, false so Express responds with a standard 403 / CORS block
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is live now."
    });
});

export default app;
