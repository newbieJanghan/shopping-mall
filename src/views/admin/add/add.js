import * as Api from '/api.js';

const $productForm = document.querySelector('#registerProductForm');
const $title = document.querySelector('#titleInput');
const $categorySelectBox = document.querySelector('#categorySelectBox');
const $brand = document.querySelector('#manufacturerInput');
const $shortDescription = document.querySelector('#shortDescriptionInput');
const $detailDescription = document.querySelector('#detailDescriptionInput');
const $hashtag = document.querySelector('#hashtagInput');
const $price = document.querySelector('#priceInput');
const $imageInput = document.querySelector('#imageInput');
const $fileNameSpan = document.querySelector('#fileNameSpan');
const $addSizeButton = document.querySelector('#addSizeButton');
// const $delSizeButton = document.querySelector('.delSizeButton');
const $addStockbySizeForm = document.querySelector('#addStockBySizeForm');

function applyFileName(event) {
  $fileNameSpan.innerHTML = event.target.files[0].name;
}

async function getCategories() {
  const categories = await Api.get('/api/admin', 'categories');
  const options = categories.reduce(
    (acc, category) =>
      (acc += `
  <option
  value="${category.name}"
  class="re-notification">
  ${category.name}
  </option>`),
    '',
  );
  $categorySelectBox.insertAdjacentHTML('beforeend', options);
}

async function addProduct(e) {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('img', e.target.img.files[0]);
    const result = await Api.postImage(formData);

    const newProductData = getData(result.url);

    await Api.post('/api/admin/products', newProductData);
    alert('상품이 성공적으로 추가되었습니다!');
    // location.reload();
  } catch (err) {
    if (err.message === 'Invalid Value') {
      alert('채워지지 않은 항목이 있습니다.');
    } else {
      console.error(err);
    }
  }
}

const getHashtag = (hashtag) => {
  const result = hashtag
    .split(',')
    .map((input) => input.trim())
    .map((input) => {
      if (input.charAt() == '#') {
        return input.replace('#', '');
      } else {
        return undefined;
      }
    })
    .filter((el) => el);
  return result;
};

function getData(imageURL) {
  // stock object 가져오기
  const stock = getStock();

  // hashtag
  const hashtagValue = $hashtag.value;
  const hashtag = getHashtag(hashtagValue);

  const newProductData = {
    name: $title.value,
    brand: $brand.value,
    shortDescription: $shortDescription.value,
    detailDescription: $detailDescription.value,
    hashtag,
    price: $price.value,
    category: $categorySelectBox.value,
    imageURL,
    stock,
  };

  // 비워져있는 칸이 있는지 검증
  const isValid = Object.values(newProductData).filter((value) => !value);

  if (isValid.length) {
    throw new Error('Invalid Value');
  } else {
    return newProductData;
  }
}

async function addSize(event) {
  event.preventDefault();
  try {
    const sizeInputValue = document
      .querySelector('#sizeInput')
      .value.toUpperCase();
    if (!sizeInputValue) {
      throw new Error('사이즈를 입력해주세요.');
    }

    const sizes = sizeInputValue.split(',');
    sizes.map((size) => {
      $addStockbySizeForm.insertAdjacentHTML(
        'beforeend',
        `
      <div class="field" id=${size}-container>
      <label class="label" for="stockInput"
        >${size}</label
      >
      <div class="control">
        <input
          class="input"
          name="stockInput"
          id="${size}"
          type="number"
          placeholder="100"
          autocomplete="on"
        />
      </div>
      <button type="button" class="delSizeButton" onclick="delSize(event)">사이즈 삭제</button>
      </div>
      `,
      );
    });
  } catch (err) {
    alert(err.message);
    return;
  }
}
/* html script에 정의함
async function delSize(event) {
  event.preventDefault();
  const parent = event.target.parentNode;
  parent.innerHTML = '';
} */

function getStock() {
  const stockContainer = document.querySelectorAll('input[name="stockInput"]');
  const formData = new FormData();
  if (!stockContainer.length) {
    const key = stockContainer.getAttribute('id');
    const value = stockContainer.value;
    formData[key] = value;
  } else {
    stockContainer.forEach((node) => {
      const key = node.getAttribute('id').trim();
      const value = node.value;
      formData[key] = Number(value);
    });
  }
  const object = JSON.stringify(formData);
  const result = JSON.parse(object);
  return result;
}

getCategories();

$productForm.addEventListener('submit', addProduct);
$imageInput.addEventListener('change', applyFileName);
$addSizeButton.addEventListener('click', addSize);
// $delSizeButton.addEventListener('click', delSize);
