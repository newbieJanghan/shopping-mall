import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';

const $swiperWrapper = document.querySelector('#swiperWrapper');

new Swiper('.mySwiper', {
  spaceBetween: 0,
  centeredSlides: true,
  rewind: true,

  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

getCategories();

async function getCategories() {
  const categories = await Api.get('/api/admin', 'categories');
  const slides = categories.reduce(
    (acc, category) =>
      (acc += `
      <div class="swiper-slide">
      <a href="/product/list?category=${category.shortId}">
      <div class="overlay"></div>
      <div class="slide-textbox">
        <span>${category.name}</span>
        <p>${category.content}</p>
      </div>
        <img
          src=${category.imageURL}
          alt=${category.name}
        />
        </a>
        </div>
  `),
    '',
  );
  $swiperWrapper.insertAdjacentHTML('afterbegin', slides);
}

const $homeProductListNew = document.querySelector('.home-product-list-new');
const $homeProductListLikes = document.querySelector(
  '.home-product-list-likes',
);

getProductList($homeProductListNew, 'new');
getProductList($homeProductListLikes, 'likes');

function printProductList(ele, products) {
  const dataProduct = products.reduce((acc, product) => {
    return (acc += `<div class="home-product-list-item">
    <a href="/products/detail/${product.shortId}">
      <div class="image">
        <div class="image-thumbnail">
          <img
            src="${product.imageURL}"
          />
        </div>
      </div>
      <div class="description">
        <p class="description-name">${product.name}</p>
        <p class="description-price">${addCommas(product.price)}</p>
      </div>
    </a>
  </div>`);
  }, '');

  if (products.length) {
    ele.insertAdjacentHTML('afterbegin', dataProduct);
  }
}

async function getProductList(ele, getApi) {
  try {
    const start = +new Date()
    const result = await Api.get(`/api/products/list/${getApi}`);
    const end = +new Date()
    const diff = end - start
    console.log("time: ", diff)
    printProductList(ele, result);
  } catch (err) {
    console.error(err);
    alert(`${err.message}`);
  }
}
