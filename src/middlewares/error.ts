import { NextFunction, Response, Request } from 'express';
import { IPrError } from './types';

const nextErrors = (err: IPrError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message = 'Error, try again', name } = err;
  if (name === 'ValidationError' || name === 'CastError') return res.status(400).json({ message: 'Incorrect data' });
  res.status(statusCode).send({ message });
  return next();
};
export default nextErrors;
