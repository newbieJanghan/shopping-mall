import { productModel } from '../db';
import { categoryService } from './';
class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async addProduct(productInfo) {
    const {
      category,
      brand,
      name,
      shortDescription,
      detailDescription,
      imageURL,
      price,
      stock
    } = productInfo;

    const product = await this.productModel.findByName(name);
    if (product) {
      throw new Error('이미 해당 상품이 존재합니다.');
    }

    const categoryId = await categoryService.getIdByName(category);
    const newProductInfo = {
      categoryId,
      brand,
      name,
      shortDescription,
      detailDescription,
      imageURL,
      price: Number(price),
      stock
    };

    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);
    return createdNewProduct;
  }

  // 모든 상품 목록을 받음.
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  // 상품 상세 조회
  async getProduct(shortId) {
    const product = await this.productModel.findByShortId(shortId);

    if (!product) {
      throw new Error('해당 상품이 존재하지 않습니다.');
    }

    return product;
  }

  // name으로 상품 검색
  async getProductsByName(filter) {
    const products = await this.productModel.findBySearch(filter);
    return products;
  }

  //category에 따른 상품 목록
  async getProductsByCategoryId(categoryId) {
    const products = await this.productModel.findAllByCategoryId(categoryId);
    return products;
  }

  //brand에 따른 상품 목록
  async getProductsByBrand(brand) {
    const products = await this.productModel.findAllByBrand(brand);
    return products;
  }

  // 상품 정보 수정
  async setProduct(shortId, updateRequest) {
    // 상품 존재 여부 확인 후 에러 반환
    let product = await this.productModel.findByShortId(shortId);

    if (!product) {
      throw new Error('상품이 존재하지 않습니다. 다시 한 번 확인해 주세요.');
    }
    // new category => new categoryId
    const {
      category,
      brand,
      name,
      shortDescription,
      detailDescription,
      imageURL,
      price,
    } = await updateRequest;

    const update = {
      categoryId: category,
      brand,
      name,
      shortDescription,
      detailDescription,
      imageURL,
      price,
    };

    // 업데이트 진행
    product = await this.productModel.update({
      shortId,
      update,
    });
    return product;
  }

  //상품 삭제
  async deleteProduct(shortId) {
    const { _id } = await this.productModel.findByShortId(shortId);

    if (!_id) {
      throw new Error('상품이 존재하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    const product = await this.productModel.delete(_id);

    if (!product) {
      throw new Error('삭제에 실패하였습니다.');
    }
    
    return product;
  }

  // 좋아요 기능
  async updateLikeCount(product, userId, isLike) {
    const updatedLike = await this.productModel.updateLike(
      product,
      userId,
      isLike,
    );
    return updatedLike;
  }
}

const productService = new ProductService(productModel);

export { productService };
