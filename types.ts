import type { Request } from "express-serve-static-core";

export type UserRequest = Request & {
  user: {
    userId: string;
    name: string;
  };
};

export type AuthRequest = UserRequest & {
  headers: {
    authorization: string;
  };
};

export type JobRequest = UserRequest & {
  body: {
    createdBy: string;
    company: string;
    position: string;
  };
  params: {
    id: string;
  };
};
