import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/notFound';
import Forbidden from '../errors/forbidden';
import BadRequest from '../errors/badRequest';

export const addCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = (req as any).user._id;
    const card = new Card({
      name,
      link,
      owner,
    });
    await card.save();
    return res.send(card);
  } catch (err) {
    const errName = (err as Error).name;
    if (errName === 'ValidationError') next(new BadRequest((err as Error).message));
    else next(new Error());
    next(err);
  }
};

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    next(err);
  }
};

export const putLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) throw new NotFoundError('Карточки с таким ID не существует');
    return res.send({ message: 'Лайк поставлен.' });
  } catch (err) {
    next(err);
    const errName = (err as Error).name;
    if (errName === 'CastError') next(new BadRequest((err as Error).message));
    else next(new Error());
  }
};

export const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) throw new NotFoundError('Карточки с таким ID не существует');
    return res.send({ message: 'Лайк удален' });
  } catch (err) {
    next(err);
    const errName = (err as Error).name;
    if (errName === 'CastError') next(new BadRequest((err as Error).message));
    else next(new Error());
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = (req as any).user._id;
    const card = await Card.findById(cardId);
    if (!card) throw new NotFoundError('Карточки с таким ID не существует');
    if (card.owner.toString() !== userId) throw new Forbidden('Пользователь не может удалять чужие карточки');
    await card.remove();
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    const errName = (err as Error).name;
    if (errName === 'CastError') next(new BadRequest((err as Error).message));
    else next(new Error());
    next(err);
  }
};
