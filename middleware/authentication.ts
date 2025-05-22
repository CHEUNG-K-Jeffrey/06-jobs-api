import type {
	Request,
	Response,
	NextFunction,
} from "express-serve-static-core";
import type { AuthRequest } from "../types.ts";

import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.ts";

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	// check header
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new UnauthenticatedError("Authentication invalid");
	}
	const token = authHeader.split(" ")[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET) as {
			userId: string;
			name: string;
		};
		// attach the user to the job routes
		req.user = { userId: payload.userId, name: payload.name };
		next();
	} catch (error) {
		throw new UnauthenticatedError("Authentication invalid");
	}
};

export default auth;
