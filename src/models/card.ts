import { Schema, model } from 'mongoose';
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
    }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default model<ICard>('Card', cardSchema);
