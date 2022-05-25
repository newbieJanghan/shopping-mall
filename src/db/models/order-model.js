import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  // 주문 상세 조회
  async findById(orderId) {
    const order = await Order.findOne({ _id: orderId });
    return order;
  }

  // 사용자용 주문 상세 조회 - 코치님한테 물어보기
  async findById(userId) {
    const orders = await Order.findMany({ orderer: { userId: userId } });
    return orders;
  }

  // 주문 생성
  async create(orderInfo) {
    // product 정보 가져오기
    const {
      shortId,
      quantity,
      ordererName,
      phoneNumber,
      address,
      deliveryRequest,
    } = orderInfo;
    const { product } = await Order.findOne(shortId);
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  // 관리자용 주문 전체 조회
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  // 주문 수정
  async update({ orderId, update }) {
    const filter = { _id: orderId };
    // 갱신된 document를 반환한다.
    const option = { returnOriginal: false };

    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  // 주문 취소
  async delete({ orderId }) {
    const deletedOrder = await Order.findOneAndDelete({ _id: orderId });
    return deletedOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
