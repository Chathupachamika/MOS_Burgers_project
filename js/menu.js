import { getProducts, setProduct, deleteProductFromArray } from "./data.js";

let products = getProducts();

function showAddMenuItemModal() {
  const myModal = new bootstrap.Modal("#modalAddProduct");
  myModal.show();
}

document
  .getElementById("btnAddNewProduct")
  .addEventListener("click", showAddMenuItemModal);

//Currurent Category to load
let currentCategory = "Burgers";

//Render Product List
function renderProductList(category) {
  currentCategory = category;
  const productListContainer = document.getElementById("product-list");
  productListContainer.innerHTML = "";

  if (products[category]) {
    products[category].forEach((product, index) => {
      const productCard = document.createElement("div");
      productCard.className = "col-md-3 mb-3";
      productCard.innerHTML = `
                <div class="card product-card align-items-center">
                    <img src="${product.img}" class="card-img-top" alt="${
        product.name
      }">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text product-price">LKR ${product.price.toFixed(
                          2
                        )}</p>
                        <div class="row">
                          <div class="col-12">
                              <div class="action-icons d-flex justify-content-center">
                            <img src="../assets/icons/eye.svg" alt="" id="btnView-${index}">
                            <img src="../assets/icons/edit.svg" alt="" id="btnEdit-${index}">
                            <img src="../assets/icons/trash.svg" alt="" id="btnDelete-${index}">
                          </div>
                          </div>
                        </div>
                    </div>
                </div>
            `;
      productListContainer.appendChild(productCard);

      document
        .getElementById(`btnView-${index}`)
        .addEventListener("click", () => loadProductDetails(index));
      document
        .getElementById(`btnEdit-${index}`)
        .addEventListener("click", () => loadProductToModal(index));
      document
        .getElementById(`btnDelete-${index}`)
        .addEventListener("click", () => deleteProduct(index));
    });
  }
}

//Load Product Details
function loadProductDetails(index) {
  const product = products[currentCategory][index];

  document.getElementById("viewItemCode").innerText = product.itemCode;
  document.getElementById("viewProductName").innerText = product.name;
  document.getElementById("viewProductCategory").innerText = currentCategory;
  document.getElementById("viewProductPrice").innerText =
    product.price.toFixed(2);
  document.getElementById("viewProductDiscount").innerText = product.discount;

  if (product.img) {
    document.getElementById("viewProductImage").src = product.img;
    document.getElementById("viewProductImage").style.display = "block";
  } else {
    document.getElementById("viewProductImage").style.display = "none";
  }

  const productModal = new bootstrap.Modal("#modalViewProduct");
  productModal.show();
}

//Load product details to edit
function loadProductToModal(index) {
  const product = products[currentCategory][index];

  document.getElementById("modalItemCode").value = product.itemCode;
  document.getElementById("modalProductName").value = product.name;
  document.getElementById("modalPrice").value = product.price;
  document.getElementById("modalDiscount").value = product.discount;
  const category = document.getElementById("modalProductCategory");
  category.value = currentCategory;

  if (product.img) {
    document.getElementById("modalProductImage").src = product.img;
    document.getElementById("modalProductImage").style.display = "block";
  }

  const productModal = new bootstrap.Modal("#modalAddProduct");
  productModal.show();
}

//Search Products By Name
function searchProducts() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const productListContainer = document.getElementById("product-list");
  productListContainer.innerHTML = "";

  if (products[currentCategory]) {
    const filteredProducts = products[currentCategory].filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );

    // Render the filtered products
    filteredProducts.forEach((product, index) => {
      const productCard = document.createElement("div");
      productCard.className = "col-md-3 mb-3";
      productCard.innerHTML = `
                <div class="card product-card align-items-center">
                    <img src="${product.img}" class="card-img-top" alt="${
        product.name
      }">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text product-price">LKR ${product.price.toFixed(
                          2
                        )}</p>
                        <div class="row">
                          <div class="col-12">
                              <div class="action-icons d-flex justify-content-center">
                            <img src="../assets/icons/eye.svg" alt="" id="btnView-${index}">
                            <img src="../assets/icons/edit.svg" alt="" id="btnEdit-${index}">
                            <img src="../assets/icons/trash.svg" alt="" id="btnDelete-${index}">
                          </div>
                          </div>
                        </div>
                    </div>
                </div>
            `;
      productListContainer.appendChild(productCard);

      document
        .getElementById(`btnView-${index}`)
        .addEventListener("click", () => loadProductDetails(index));
      document
        .getElementById(`btnEdit-${index}`)
        .addEventListener("click", () => loadProductToModal(index));
      document
        .getElementById(`btnDelete-${index}`)
        .addEventListener("click", () => deleteProduct(index));
    });
  }
}

document.getElementById("search-bar").addEventListener("input", searchProducts);

//Image Preview
let uploadedImage = "";

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("modalProductImage").src = e.target.result;
      document.getElementById("modalProductImage").style.display = "block";
      uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

document
  .getElementById("modalProductImage")
  .addEventListener("change", previewImage);

//Add New Product
function addNewProduct() {
  // Get values from the form inputs
  const productCode = document.getElementById("modalItemCode").value;
  const productName = document.getElementById("modalProductName").value;
  const productPrice = parseFloat(document.getElementById("modalPrice").value);
  const category = document.getElementById("modalProductCategory");
  const discount = parseFloat(document.getElementById("modalDiscount").value);

  const productCategory = category.options[category.selectedIndex].text;

  for (let i = 0; i < products[productCategory].length; i++) {
    if (products[productCategory][i].itemCode === productCode) {
      deleteProduct(i);
    }
  }
  // Create a new product object
  const newProduct = {
    itemCode: productCode,
    name: productName,
    price: productPrice,
    discount: discount,
    img: uploadedImage,
  };

  if (!products[productCategory]) {
    products[productCategory] = [];
  }

  currentCategory = productCategory;

  //Add Product to Array
  setProduct(newProduct, currentCategory);
  updateProductList(newProduct, products[productCategory].length - 1);
  showSuccessModal();

  const myModal = new bootstrap.Modal("#modalAddProduct");
  myModal.hide();
}
function showSuccessModal() {
  const successModal = new bootstrap.Modal("#successAlertModal");
  successModal.show();
}

//Update Product List
function updateProductList(newProduct, index) {
  // Render the new product
  const productListContainer = document.getElementById("product-list");
  const productCard = document.createElement("div");

  productCard.className = "col-md-3 mb-3";
  productCard.innerHTML = `
      <div class="card product-card align-items-center">
          <img src="${newProduct.img}" class="card-img-top" alt="${
    newProduct.name
  }">
          <div class="card-body">
              <h5 class="card-title">${newProduct.name}</h5>
              <p class="card-text product-price">LKR ${newProduct.price.toFixed(
                2
              )}</p>
              <div class="row">
                <div class="col-12">
                    <div class="action-icons d-flex justify-content-center">
                      <img src="../assets/icons/eye.svg" alt="view" id="btnView-${index}">
                      <img src="../assets/icons/edit.svg" alt="edit" id="btnEdit-${index}">
                      <img src="../assets/icons/trash.svg" alt="delete" id="btnDelete-${index}">
                    </div>
                </div>
              </div>
          </div>
      </div>
  `;
  console.log("update");

  productListContainer.appendChild(productCard);

  document
    .getElementById(`btnView-${index}`)
    .addEventListener("click", () => loadProductDetails(index));
  document
    .getElementById(`btnEdit-${index}`)
    .addEventListener("click", () => loadProductToModal(index));
  document
    .getElementById(`btnDelete-${index}`)
    .addEventListener("click", () => deleteProduct(index));

  showSuccessModal();

  // alert("Product added successfully!");
}

// Delete product
function deleteProduct(index) {
  deleteProductFromArray(index, currentCategory);
  renderProductList(currentCategory);
}

// load products when page loaded
window.onload = function () {
  renderProductList(currentCategory);
};

//Stop Refreshing the page
let form = document.getElementById("productForm");
function handleForm(event) {
  event.preventDefault();
}
form.addEventListener("submit", handleForm);

//Add Product Button Action
document
  .getElementById("btnAddProductSubmit")
  .addEventListener("click", addNewProduct);

// Product Category button Action

//Burgers
document
  .getElementById("burgers")
  .addEventListener("click", renderProductList.bind(null, "Burgers"));

//Pasta
document
  .getElementById("pasta")
  .addEventListener("click", renderProductList.bind(null, "Pasta"));

//Submarine
document
  .getElementById("submarine")
  .addEventListener("click", renderProductList.bind(null, "Submarines"));

//Fries
document
  .getElementById("fries")
  .addEventListener("click", renderProductList.bind(null, "Fries"));

//Chicken
document
  .getElementById("chicken")
  .addEventListener("click", renderProductList.bind(null, "Chicken"));

//Beverages
document
  .getElementById("beverages")
  .addEventListener("click", renderProductList.bind(null, "Beverages"));
