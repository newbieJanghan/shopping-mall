import { Router } from 'express';
import is from '@sindresorhus/is';
import jwt from 'jsonwebtoken';
import { adminRequired } from '../middlewares';
import {
  orderService,
  productService,
  categoryService,
  userService,
} from '../services';

const adminRouter = Router();

// 관리자 메인 페이지
adminRouter.get('/', adminRequired, async (req, res, next) => {
  try {
    res.status(200).json({
      result: 'approach-success',
    });
  } catch (err) {
    next(err);
  }
});

// 관리자 로그인 여부 확인 후 navbar 변경
adminRouter.post('/', async (req, res, next) => {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    if (!userToken || userToken === 'null') {
      res.status(200).json({
        result: 'fail',
      });
    } else {
      const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
      const jwtDecoded = jwt.verify(userToken, secretKey);
      const role = jwtDecoded.role;
      if (role === 'admin') {
        res.status(200).json({
          result: 'admin',
        });
      } else if (role === 'basic-user') {
        res.status(200).json({
          result: 'basic-user',
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

/****************************/
/********* category *********/
/****************************/

// 카테고리 생성
adminRouter.post(
  '/categories/create',
  adminRequired,
  async (req, res, next) => {
    try {
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }
      const { name, content, imageURL } = req.body;
      const newCategory = await categoryService.addCategory({
        name,
        content,
        imageURL,
      });
      res.status(200).json(newCategory);
    } catch (err) {
      next(err);
    }
  },
);

// 카테고리 목록
adminRouter.get('/categories', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

// 카테고리 상세 조회
adminRouter.get('/categories/:shortId', adminRequired, async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const category = await categoryService.getCategory(shortId);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
});

// 카테고리 변경
adminRouter.patch(
  '/categories/:shortId/update',
  adminRequired,
  async (req, res, next) => {
    try {
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }
      const { shortId } = req.params;

      // const { name, content, imageURL } = req.body;
      // const toUpdate = {
      //   ...(name && { name }),
      //   ...(content && { content }),
      //   ...(imageURL && { imageURL }),
      // };

      // 프론트 데이터가 undefined 또는 없다면 toUpdate 객체에 담기지 않음
      // 따라서 아무 값도 없는 경우 db 상에서 기존 값이 그대로 유지됨.
      // login에서는 중요하나, product나 category에서는 중요한가? 싶음.
      const toUpdate = req.body;
      for (let key of Object.keys(toUpdate)) {
        if (!toUpdate[key]) {
          delete toUpdate[key];
        }
      }

      const updatedCategory = await categoryService.setCategory(
        shortId,
        toUpdate,
      );
      res.status(200).json(updatedCategory);
    } catch (err) {
      next(err);
    }
  },
);

// 카테고리 삭제
adminRouter.delete(
  '/categories/:shortId/delete',
  adminRequired,
  async (req, res, next) => {
    try {
      const { shortId } = req.params;
      const result = await categoryService.deleteCategory(shortId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

/****************************/
/********* products *********/
/****************************/

// 상품 추가
adminRouter.post('/products', adminRequired, async (req, res, next) => {
  try {
    const {
      category,
      brand,
      name,
      shortDescription,
      detailDescription,
      imageURL,
      price,
      stock
    } = req.body;
    const newproduct = await productService.addProduct({
      category,
      brand,
      name,
      shortDescription,
      detailDescription,
      imageURL,
      price,
      stock
    });
    res.status(200).json(newproduct);
  } catch (err) {
    next(err);
  }
});

// 상품 전부 조회
adminRouter.get('/products', adminRequired, async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// 상품 상세 조회
adminRouter.get('/products/:shortId', adminRequired, async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const product = await productService.getProduct(shortId);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// 상품 삭제
adminRouter.delete(
  '/products/:shortId/delete',
  adminRequired,
  async (req, res, next) => {
    try {
      const { shortId } = req.params;
      const result = await productService.deleteProduct(shortId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 상품 정보 수정
adminRouter.patch(
  '/products/:shortId',
  adminRequired,
  async (req, res, next) => {
    try {
      const { shortId } = req.params;
      // const {
      //   category,
      //   brand,
      //   name,
      //   shortDescription,
      //   detailDescription,
      //   imageURL,
      //   price,
      //   likeCount,
      //   likeUsers,
      // } = req.body;

      // const toUpdate = {
      //   ...(category && { category }),
      //   ...(brand && { brand }),
      //   ...(name && { name }),
      //   ...(shortDescription && { shortDescription }),
      //   ...(detailDescription && { detailDescription }),
      //   ...(imageURL && { imageURL }),
      //   ...(price && { price }),
      //   ...(likeCount && { likeCount }),
      //   ...(likeUsers && { likeUsers }),
      // };

      // 프론트 데이터가 undefined 또는 없다면 toUpdate 객체에 담기지 않음
      // 따라서 아무 값도 없는 경우 db 상에서 기존 값이 그대로 유지됨.
      // login에서는 중요하나, product나 category에서는 중요한가? 싶음.
      const toUpdate = req.body;
      for (let key of Object.keys(toUpdate)) {
        if (!toUpdate[key]) {
          delete toUpdate[key];
        }
      }

      const updatedProduct = await productService.setProduct(shortId, toUpdate);
      res.status(200).json(updatedProduct);
    } catch (err) {
      next(err);
    }
  },
);

/******************************/
/********* user,order *********/
/******************************/

// 전체 사용자 목록 조회
adminRouter.get('/userlist', adminRequired, async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// 특정 사용자 주문 목록 조회
adminRouter.get('/orders/list', adminRequired, async (req, res, next) => {
  try {
    const { email } = req.query;
    const userId = await userService.getUserIdByEmail(email);
    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

// 특정 사용자 주문 상세 조회
adminRouter.get('/orders/:shortId', adminRequired, async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const order = await orderService.getOrderInfo(shortId);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

//사용자 주문 취소
adminRouter.delete(
  '/orders/:shortId',
  adminRequired,
  async (req, res, next) => {
    try {
      const { shortId } = req.params;
      const deletedOrder = await orderService.updateOrder(shortId);
      res.status(200).json(deletedOrder);
    } catch (err) {
      next(err);
    }
  },
);

export { adminRouter };
