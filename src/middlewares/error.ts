import { NextFunction, Response, Request } from 'express';
import { IPrError } from './types';

const nextErrors = (err: IPrError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message = 'Произошла ошибка, попробуйте снова', name } = err;
  if (name === 'ValidationError' || name === 'CastError') res.status(400).json({ message: 'Переданы некорректные данные' });
  res.status(statusCode).send({ message });
  return next();
};
export default nextErrors;
