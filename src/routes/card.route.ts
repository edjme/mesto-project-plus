import { Router } from 'express';
import config from 'config';
import {
  addCard, deleteCard, deleteLike, getCards, putLike,
} from '../controllers/cards';
import { validatorAddCard, validatorCardId } from '../validator/celebrate';

const cardRouter = Router();
const cardsPath: string = config.get('cardsPath');
const idCardsPath: string = config.get('idCardsPath');
const cardLikesPath: string = config.get('cardLikesPath');

cardRouter.post(
  cardsPath,
  validatorAddCard,
  addCard,
);

cardRouter.get(cardsPath, getCards);

cardRouter.put(cardLikesPath, validatorCardId, putLike);

cardRouter.delete(cardLikesPath, validatorCardId, deleteLike);

cardRouter.delete(idCardsPath, validatorCardId, deleteCard);
export default cardRouter;
