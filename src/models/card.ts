import { Schema, model } from 'mongoose';
import validator from 'validator';
import { ICard } from '../middlewares/types';

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Incorrect URL',
      },
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default model<ICard>('card', cardSchema);
