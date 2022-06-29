import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async findByName(name) {
    const product = await Product.findOne({ name });
    return product;
  }

  async findBySearch(filter) {
    const product = await Product.find(
      { $text: { $search: filter } },
      { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } });
    console.log(product);
    return product;
  }

  async findByShortId(shortId) {
    const product = await Product.findOne({ shortId });
    return product;
  }

  async findAllByCategoryId(categoryId) {
    const products = await Product.find({ categoryId });
    return products;
  }

  // async findAllByBrand(brand) {
  //   const products = await Product.find({ brand });
  //   return products;
  // }

  async findAll() {
    const products = await Product.find({});
    return products;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async update({ shortId, update }) {
    const filter = { shortId };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedProduct;
  }

  async delete(_id) {
    const result = await Product.findOneAndDelete({ _id });
    return result;
  }

  // 좋아요
  async updateLike(product, userId, isLike) {
    const filter = { _id: product._id };
    const option = { returnOriginal: false };
    let updatedLike;
    if (isLike === false) {
      updatedLike = await Product.findOneAndUpdate(
        filter,
        {
          $inc: { likeCount: -1 },
          $pull: { likeUsers: { userId } },
        },
        option,
      );
    } else {
      updatedLike = await Product.findOneAndUpdate(
        filter,
        {
          $inc: { likeCount: 1 },
          $push: { likeUsers: { userId } },
        },
        option,
      );
    }
    return updatedLike;
  }
}

const productModel = new ProductModel();

export { productModel };
