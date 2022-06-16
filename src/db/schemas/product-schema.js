import { Schema } from 'mongoose';
import { shortId } from './types/short-id';

const ProductSchema = new Schema(
  {
    shortId,
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    detailDescription: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    likeUsers: [{ userId: { type: String } }],
    stocks: {
      type: Array,
      required: true,
    }
  },
  {
    timestamps: true,
    collection: 'products',
  },
);

export { ProductSchema };
