import * as Api from '/api.js';
import { dateYearMonthDay } from '/useful-functions.js';
// 요소(element), input 혹은 상수
const $accountOrder = document.querySelector('.account-orders');
const $deleteOrderButton = document.querySelector('.js-delete-order-button');

addAllElements();
addAllEvents();
getUserOrders();

//임시 데이터
// const data = [
//   {
//     _id: '62940edf38cf7c43df5125e5',
//     products: [
//       {
//         productId: '628f956d56a6804dd6ab12b2',
//         quantity: 1,
//         _id: '62940edf38cf7c43df5125e6',
//       },
//     ],
//     userId: '628f1ed940a4f603fe896381',
//     ordererName: 'admin',
//     phoneNumber: '010-2222-3333',
//     deliveryRequest: '직접 수령하겠습니다.',
//     deliveryFee: 3000,
//     totalPrice: 210000,
//     shortId: 'AZ_pp-6fnYfoLG-1Ddwpa',
//     createdAt: '2022-05-30T00:25:03.125Z',
//     updatedAt: '2022-05-30T00:25:03.125Z',
//     __v: 0,
//   },
//   {
//     _id: '62940edf38cf7c43df5125e5',
//     products: [
//       {
//         productId: '628f956d56a6804dd6ab12b2',
//         quantity: 1,
//         _id: '62940edf38cf7c43df5125e6',
//       },
//     ],
//     userId: '628f1ed940a4f603fe896381',
//     ordererName: 'admin',
//     phoneNumber: '010-2222-3333',
//     deliveryRequest: '직접 수령하겠습니다.',
//     deliveryFee: 3000,
//     totalPrice: 210000,
//     shortId: 'AZ_pp-6fnYfoLG-1Ddwpa',
//     createdAt: '2022-05-30T00:25:03.125Z',
//     updatedAt: '2022-05-30T00:25:03.125Z',
//     __v: 0,
//   },
// ];

// printUserOrders(data);

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  $accountOrder.addEventListener('click', handleOrderDataDelete);
}

function printUserOrders(orders) {
  const dataOrder = orders.reduce((acc, order) => {
    return (acc += `<tr>
    <td>${dateYearMonthDay(order.createdAt)}</td>
    <td>${order.products[0].productId} / ${order.products[0].quantity} 개</td>
    <td>${order.deliveryFree}</td>
    <td>
      <button
        class="button js-delete-order-button js-modal-trigger"
        data-target="modal-js-order-cancel"
        data-order="${order.shortId}"
      >
        주문 취소
      </button>
    </td>
  </tr>`);
  }, '');

  const noDataOrder = `<tr>
  <td colspan="4" class="py-5">주문정보가 없습니다.</td>
</tr>`;

  if (orders.length) {
    $accountOrder
      .querySelector('tbody')
      .insertAdjacentHTML('afterbegin', dataOrder);
  } else {
    $accountOrder
      .querySelector('tbody')
      .insertAdjacentHTML('afterbegin', noDataOrder);
  }
}

async function getUserOrders() {
  try {
    const data = await Api.get('/api/orders');
    printUserOrders(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    alert(`${err.message}`);
  }
}

async function handleOrderDataDelete(e) {
  e.preventDefault();
  const targetElement = e.target.matches('button.js-delete-order-button');
  if (targetElement) {
    const orderId = e.target.getAttribute('data-order');
    try {
      await Api.delete('/api/orders', orderId);
    } catch (err) {
      console.error(err);
      alert(`${err.message}`);
    }
  }
}
