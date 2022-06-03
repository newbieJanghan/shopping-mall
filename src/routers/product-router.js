import { Router } from 'express';
import { productService, categoryService, userService } from '../services';
import { pagination, loginRequired } from '../middlewares';

const productRouter = Router();

//카테고리 별 상품 조회
productRouter.get('/', async (req, res, next) => {
  try {
    const { category, currentPage, CountPerPage } = req.query;
    const { _id } = await categoryService.getIdByShortId(category);
    const products = await productService.getProductsByCategoryId(_id);
    const { totalPage, posts } = await pagination(
      products,
      Number(currentPage),
      Number(CountPerPage),
    );
    res.status(200).json({
      totalPage,
      posts,
    });
  } catch (err) {
    next(err);
  }
});

//상품 검색
productRouter.get('/search/result', async (req, res, next) => {
  try {
    const { q, currentPage, CountPerPage } = req.query;
    const result = await productService.getProductsByName(q);
    const { totalPage, posts } = await pagination(
      result,
      Number(currentPage),
      Number(CountPerPage),
    );
    res.status(200).json({
      totalPage,
      posts,
    });
    //res.status(200).json(result)
  } catch (err) {
    next(err);
  }
});

//상품 상세 조회
productRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProduct(id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

//상품 좋아요 top 4 조회
productRouter.get('/list/likes', async (req, res, next) => {
  try {
    const allProducts = await productService.getProducts();
    const products = allProducts
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 4);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

//상품 최신순 top 4 조회
productRouter.get('/list/new', async (req, res, next) => {
  try {
    const allProducts = await productService.getProducts();
    const products = allProducts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});
productRouter.patch('/like/:id', loginRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.currentUserId;
    const isLike = JSON.parse(req.body.isLike);

    // 특정 상품 가져오기
    const product = await productService.getProduct(id);

    // 유저의 shortId를 likeUsers에 추가 / 그 상품의 좋아요 업데이트
    const updatedLike = await productService.updateLikeCount(
      product,
      userId,
      isLike,
    );
    res.status(200).json(updatedLike);
  } catch (err) {
    next(err);
  }
});

// 좋아요 조회
productRouter.get('/likes/:id', loginRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.currentUserId;
    const product = await productService.getProduct(id);
    const isUser = product.likeUsers.find((ele) => ele.userId === userId);
    res.status(200).json({ isUser });
  } catch (err) {
    next(err);
  }
});

export { productRouter };
