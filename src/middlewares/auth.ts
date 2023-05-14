import { Request, Response, NextFunction } from 'express';
import jwt, { UserIDJwtPayload } from 'jsonwebtoken';
import process from 'process';
import Unauthorized from '../errors/unauthorized';

const { JWT_SECRET = 'TEST_KEY' } = process.env;
export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Unauthorized('Необходима авторизация');
    }
    const token = req.headers.authorization!.split(' ')[1];
    const isVerifiedToken = <UserIDJwtPayload>jwt.verify(token, JWT_SECRET!);
    (req as any).user = isVerifiedToken;
    return next();
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }
};
