import type { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
	statusCode: StatusCodes;
}

export default CustomAPIError;
