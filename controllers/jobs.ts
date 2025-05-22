import type { JobRequest } from "../types.ts";
import type { Response } from "express-serve-static-core";
import Job from "../models/Job.ts";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.ts";

const getAllJobs = async (req: JobRequest, res: Response) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req: JobRequest, res: Response) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req: JobRequest, res: Response) => {
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req: JobRequest, res: Response) => {
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req;

	if (company === "" || position === "") {
		throw new BadRequestError("Company or Position fields cannot be empty");
	}
	const job = await Job.findByIdAndUpdate(
		{ _id: jobId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true },
	);
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req: JobRequest, res: Response) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await Job.findByIdAndDelete({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).send();
};

export { createJob, deleteJob, getAllJobs, updateJob, getJob };
