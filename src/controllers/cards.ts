import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/notFound';
import Forbidden from '../errors/forbidden';

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
    return res.status(201).json({ message: `Карточка с названием ${name} успешно создана` });
  } catch (err) {
    next(err);
    const errName = (err as Error).name;
    if (errName === 'ValidationError') return res.status(400).send({ message: 'Inncorect data' });
    return res.status(500).json({ message: 'Error, try again' });
  }
};

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    next(err);
    return res.status(500).json({ message: 'Error, try again' });
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
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Inncorect data' });
    return res.status(500).json({ message: 'Error, try again' });
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
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Inncorect data' });
    return res.status(500).json({ message: 'Error, try again' });
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
    next(err);
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Inncorect data' });
    return res.status(500).json({ message: 'Error, try again' });
  }
};
