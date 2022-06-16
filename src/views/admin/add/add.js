import * as Api from '/api.js';

const $productForm = document.querySelector('#registerProductForm');
const $title = document.querySelector('#titleInput');
const $categorySelectBox = document.querySelector('#categorySelectBox');
const $brand = document.querySelector('#manufacturerInput');
const $shortDescription = document.querySelector('#shortDescriptionInput');
const $detailDescription = document.querySelector('#detailDescriptionInput');
const $price = document.querySelector('#priceInput');
const $imageInput = document.querySelector('#imageInput');
const $fileNameSpan = document.querySelector('#fileNameSpan');
const $addSizeButton = document.querySelector('#addSizeButton');
const $addStocksBySizeForm = document.querySelector('#addStocksBySizeForm')

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
    console.log(newProductData)
    await Api.post('/api/admin/products', newProductData);
    alert('상품이 성공적으로 추가되었습니다!');
    location.reload();
  } catch (err) {
    if (err.message === 'Invalid Value') {
      alert('채워지지 않은 항목이 있습니다.');
    } else {
      console.error(err);
    }
  }
}

function getData(imageURL) {
  // stock object 가져오기
  const stocks = getStocks()
  console.log(stocks)
  const newProductData = {
    name: $title.value,
    brand: $brand.value,
    shortDescription: $shortDescription.value,
    detailDescription: $detailDescription.value,
    price: $price.value,
    category: $categorySelectBox.value,
    imageURL,
    stocks: [stocks]
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
      $addStocksBySizeForm.insertAdjacentHTML(
        'beforeend',
        `
      <div class="field">
      <label class="label" for="stockInput"
        >${size}</label
      >
      <div class="control">
        <input
          class="input"
          name="stocksInput"
          id="${size}"
          type="number"
          placeholder="100"
          autocomplete="on"
        />
      </div>
      `,
      );
    });
  } catch (err) {
    alert(err.message);
    return;
  }
}

function getStocks() {
  const form = document.forms["stocksInputForm"].elements["stocksInput"]
  const formData = new FormData()
  if (!form.length) {
    const key = form.getAttribute('id')
    const value = form.value
    formData[key] = value;
  } else {
    form.forEach(node => {
      const key = node.getAttribute('id')
      const value = node.value
      formData[key] = value;
    })
  }
  const object = JSON.stringify(formData)
  return JSON.parse(object)
}

getCategories();

$productForm.addEventListener('submit', addProduct);
$imageInput.addEventListener('change', applyFileName);
$addSizeButton.addEventListener('click', addSize);
