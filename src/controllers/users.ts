import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import User from '../models/user';
import NotFoundError from '../errors/notFound';
import BadRequest from '../errors/badRequest';
import Conflict from '../errors/conflict';
import Unauthorized from '../errors/unauthorized';

dotenv.config();
const { JWT_SECRET = 'TEST_KEY' } = process.env;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const isRegistered = await User.findOne({ email });
    if (isRegistered) throw new Conflict('Пользователь уже зарегистрирован');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email, password: hashedPassword, name, about, avatar,
    });
    await user.save();
    return res.status(201).json({ message: `Пользователь с почтой ${email} успешно создан.` });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Unauthorized('Неправильная почта или пароль');

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) throw new Unauthorized('Неправильная почта или пароль');
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET!,
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
    });
    return res.json({ token, _id: user._id });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    next(err);
    return res.status(500).json({ message: 'Error, try again' });
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Пользователь не найден');
    return res.send({ user });
  } catch (err) {
    next(err);
    return res.status(500).json({ message: 'Error, try again' });
  }
};

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as any).user._id;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Пользователь не найден');
    return res.json({ user });
  } catch (err) {
    next(err);
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Incorrect data' });
    return res.status(500).json({ message: 'Error, try again' });
  }
};

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as any).user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, about });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data',
      });
    }
    if (user === null) throw new NotFoundError('Пользователь не найден');
    return res.send({ message: 'Пользователь успешно обновлен' });
  } catch (err) {
    next(err);
    const errorName = (err as Error).name;
    if ((errorName === 'ValidationError') || (errorName === 'CastError')) return res.status(400).json({ message: 'Incorrect data' });
    return res.status(500).json({ message: 'Error, try again' });
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as any).user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect link',
      });
    }
    if (user === null) throw new NotFoundError('Пользователь не найден');
    else if (!user) throw new BadRequest('Bведены некорректные данные');
    await user.save();
    return res.send({ message: 'Аватар пользователя успешно обновлен.' });
  } catch (err) {
    next(err);
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) return res.status(400).json({ message: 'Incorrect data' });
    return res.status(500).json({ message: 'Error, try again' });
  }
};
