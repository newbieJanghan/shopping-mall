import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async findByName(name) {
    const product = await Product.findOne({ name });
    return product;
  }

  async findBySearch(filter) {
    const product = await Product.aggregate([
      { $match: { $text: { $search: filter } } },
      { $addFields: { score: { $meta: 'textScore' } } },
      { $unionWith: {
          coll: 'products',
          pipeline: [
            { $match: {
                $or: [
                  { name: { $regex: `${filter}`} },
                  { shortDescription: { $regex: `${filter}` } },
                  { keyword: { $elemMatch: { $regex: `${filter}` } } },
                ],
            } },
            { $addFields: { score: 1 } },
          ],
      }},
      { $sort: { score: -1 } },
      { $group: {
          _id: '$_id',
          categoryId: { $first: '$categoryId' },
          brand: { $first: '$brand' },
          name: { $first: '$name' },
          shortDescription: { $first: '$shortDescription' },
          detailDescription: { $first: '$detailDescription' },
          imageURL: { $first: '$imageURL' },
          price: { $first: '$price' },
          likeCount: { $first: '$likeCount' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          __v: { $first: '$__v' },
          score: { $sum: '$score' },
      }},
    ]);
    // const regex = await Product.aggregate([
    //   {
    //     $project: {
    //       categoryId: 1,
    //       brand: 1,
    //       name: 1,
    //       shortDescription: 1,
    //       detailDescription: 1,
    //       imgaeUrl: 1,
    //       likeCount: 1,
    //       price: 1,
    //       shortId: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       keyword: 1,
    //       match: {
    //         $switch: {
    //           branches: [
    //             {
    //               case: {
    //                 $regexMatch: {
    //                   input: '$name',
    //                   regex: `${filter}`,
    //                 },
    //               },
    //               then: true,
    //             },
    //             {
    //               case: {
    //                 $regexMatch: {
    //                   input: '$shortDescription',
    //                   regex: `${filter}`,
    //                 },
    //               },
    //               then: true,
    //             },
    //           ],
    //           default: false,
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $match: {
    //       match: true,
    //     },
    //   },
    // ]);
    console.log(product)
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

  async findByRank(field, sort, limit) {
    const products = await Product.find().sort({[field]: sort}).limit(limit)
    return products
  }
}

const productModel = new ProductModel();

export { productModel };
