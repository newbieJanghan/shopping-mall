import * as Api from '/api.js';

const $image = document.querySelector('#productImg');
const $title = document.querySelector('#productTitle');
const $price = document.querySelector('#productPrice');
const $categories = document.querySelector('#categorySelectBox');
const $brand = document.querySelector('#productBrand');
const $shortDescription = document.querySelector('#shortDescription');
const $detailDescription = document.querySelector('#detailDescription');
const $hashtag = document.querySelector('#hashtag');
const $editButton = document.querySelector('#editButton');
const $deleteAcceptButton = document.querySelector('#deleteAcceptButton');
const $imageInput = document.querySelector('#imageInput');
const $fileForm = document.querySelector('#fileForm');
const $fileNameSpan = document.querySelector('#fileNameSpan');
const $stockSpan = document.querySelector('#stockSpan');

const elements = [
  $title,
  $price,
  $categories,
  $brand,
  $shortDescription,
  $detailDescription,
  $hashtag
];

const path = window.location.pathname.split('/');
const id = path[path.length - 2];

async function getCategories() {
  const categories = await Api.get('/api/admin', 'categories');
  const options = categories.reduce(
    (acc, category) =>
      (acc += `
  <option
  value="${category._id}"
  class="notification is-primary is-light">
  ${category.name}
  </option>`),
    '',
  );
  $categories.insertAdjacentHTML('beforeend', options);
  printDetail();
}

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('img', event.target.img.files[0]);

  const result = await Api.postImage(formData);

  $image.src = result.url;

  await patchData();
};

async function printDetail() {
  try {
    // 상품 상세를 불러와 input 에 주입
    const product = await Api.get('/api/admin/products', id);
    $title.value = product.name;
    $price.value = product.price;
    $categories.value = product.categoryId;
    $brand.value = product.brand;
    $shortDescription.value = product.shortDescription;
    $detailDescription.value = product.detailDescription;
    $hashtag.value = product.hashtag;
    $image.src = product.imageURL;
    const stock = product.stock;
    if (typeof stock !== "object") {
      $stockSpan.textContent = '재고 없음';
    } else {
      const keys = Object.keys(stock);
      const stockText = keys.reduce(
        (acc, key) =>
          (acc += `${key}: ${stock[key]}
      `),
        '',
      );
      $stockSpan.textContent = stockText;
    }
  } catch (error) {
    console.error(error);
  }
}

const getHashtag = (hashtag) => {
  if (!hashtag.length) {
    const result = hashtag.trim().substr(1);
    console.log(`in no array condition: ${result}`)
    return result;
  } else {
    const result = hashtag.split(',')
    // .map((input) => {
    //   input.substr(1).trim();
    // });
    console.log(`in array condition: ${typeof result} ${result}`)
    return result;
  }
}

async function patchData() {
  const newProductData = {
    name: $title.value,
    brand: $brand.value,
    price: $price.value,
    category: $categories.value,
    shortDescription: $shortDescription.value,
    detailDescription: $detailDescription.value,
    hashtag:$hashtag.value,
    imageURL: $image.src,
  };

  await Api.patch('/api/admin/products', id, newProductData);
}

async function editDetail(event) {
  if (event.target.innerText === '수정') {
    event.target.innerText = '수정완료';
    toggle(false);
  } else {
    await patchData();

    event.target.innerText = '수정';
    toggle(true);
  }
}

async function deleteProduct() {
  try {
    await Api.delete(`/api/admin/products/${id}`, 'delete');
    window.location.href = '/admin/products';
  } catch (err) {
    console.error(err);
  }
}

function toggle(boolean) {
  elements.forEach((element) => {
    element.disabled = boolean;
  });
}

function applyFileName(event) {
  $fileNameSpan.innerHTML = event.target.files[0].name;
}
getCategories();

$fileForm.addEventListener('submit', handleSubmit);
$imageInput.addEventListener('change', applyFileName);
$editButton.addEventListener('click', editDetail);
$deleteAcceptButton.addEventListener('click', deleteProduct);
