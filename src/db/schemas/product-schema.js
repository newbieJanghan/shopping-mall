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
    stock: {
      type: Schema.Types.Mixed,
      required: true,
    },
    keyword: [],
  },
  {
    timestamps: true,
    collection: 'products',
  },
);

// indexes
ProductSchema.index(
  {
    name: 'text',
    shortDescription: 'text',
    detailDescription: 'text',
    keyword: 'text',
  },
  {
    weights: {
      name: 20,
      keyword: 10,
      brand: 2,
      shortDescription: 1,
      detailDescription: 1,
    },
  },
);

export { ProductSchema };
