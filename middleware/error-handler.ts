import type {
	Request,
	Response,
	NextFunction,
} from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { CustomAPIError } from "../errors/index.ts";

const errorHandlerMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const customError = {
		// set default
		statusCode:
			err instanceof CustomAPIError
				? err.statusCode
				: StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again later",
	};

	// if (err instanceof CustomAPIError) {
	//   return res.status(err.statusCode).json({ msg: err.message })
	// }

	if (err instanceof mongoose.Error.ValidationError) {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(",");
		customError.statusCode = 400;
	}
	if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue,
		)} field, please choose another value`;
		customError.statusCode = 400;
	}
	if (err instanceof mongoose.Error.CastError) {
		customError.msg = `No item found with id : ${err.value}`;
		customError.statusCode = 404;
	}

	if (customError.msg === "Something went wrong try again later")
		console.error(err.stack);

	res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
