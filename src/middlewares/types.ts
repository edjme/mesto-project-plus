import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends JwtPayload {
    _id: string;
  }
}

export interface IPrError extends Error {
  statusCode: number;
}
