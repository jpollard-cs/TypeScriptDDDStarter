import { Response, Request, NextFunction } from 'express';

export const getPing = (req: Request, res: Response, next: NextFunction) => {
  res.json({ pong: true });
};
