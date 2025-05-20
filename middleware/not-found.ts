import type { Request, Response } from "express-serve-static-core";

const notFound = (req: Request, res: Response) => {
  res.status(404).send("Route does not exist");
};

export default notFound;
