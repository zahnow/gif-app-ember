import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      // Session really should be optional, but this gets typescript to stop annoying us about it.
      session: {
        user: {
          id: string;
          name?: string;
          email?: string;
        };
      };
    }
  }
}
