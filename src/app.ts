import * as dotenv from 'dotenv';
import express from 'express';
import mongoose, { Error } from 'mongoose';
import config from 'config';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import userRouter from './routes/user.route';
import cardRouter from './routes/card.route';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import nextErrors from './middlewares/error';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/notFound';
import { validatorCreateUser, validatorloginUser } from './validator/celebrate';

const PORT = process.env.PORT || config.get('port');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.post('/signin', validatorloginUser, login);
app.post('/signup', validatorCreateUser, createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(() => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use(nextErrors);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    dotenv.config();
    await mongoose.connect(config.get('mongoUri'));
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`);
    });
  } catch (err) {
    const error = (err as Error).message;
    console.log('Ошибка сервера', error);
  }
};

start();
