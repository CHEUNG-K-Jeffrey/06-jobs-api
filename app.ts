import "dotenv/config";

// extra security packages
import helmet from "helmet";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import rateLimiter from "express-rate-limit";

// Swagger
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

import express from "express";
const app = express();

import connectDB from "./db/connect.ts";
import authenticateUser from "./middleware/authentication.ts";
// routers
import authRouter from "./routes/auth.ts";
import jobsRouter from "./routes/jobs.ts";
// error handler
import notFoundMiddleware from "./middleware/not-found.ts";
import errorHandlerMiddleware from "./middleware/error-handler.ts";

app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	}),
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
	res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`),
		);
	} catch (error) {
		console.log(error);
	}
};

start();
