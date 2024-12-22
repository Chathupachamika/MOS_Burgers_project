import {
  getCustomers,
  getOrders,
  getProducts,
  setCustomer,
  setOrder,
} from "./data.js";
  
  let products = getProducts();
  let customers = getCustomers();
  let orderList = getOrders();
  
  console.log(products);
  function dateAndTime() {
    let currentdate = new Date(); 
    let datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear();

    document.getElementById("DateandTime").innerHTML = datetime;
  }
  
  function updateOrderID() {
    document.getElementById("orderID").innerHTML = `P${(orderList.length + 1)
      .toString()
      .padStart(3, "0")}`;
  }
  
  document
    .getElementById("btnAddCustomer")
    .addEventListener("click", showAddCustomerModal);
  
  document
    .getElementById("place_order_phoneNumber")
    .addEventListener("keypress", function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        searchCustomerbyPhoneNumber();
      }
    });
  
  function searchCustomerbyPhoneNumber() {
    let number = document.getElementById("place_order_phoneNumber").value;
  
    let index = searchPhoneNumberFromArray(number);
  
    if (index != -1) {
      document.getElementById("place_order_customerName").value =
        customers[index].firstName + " " + customers[index].lastName;
      document.getElementById("place_order_location").value =
        customers[index].location;
    } else {
      alert("Customer Not Found");
    }
  }
  
  function searchPhoneNumberFromArray(number) {
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].phoneNumber === number) {
        return i;
      }
    }
    return -1;
  }
  
  function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const productListContainer = document.getElementById("product-list");
    productListContainer.innerHTML = "";
  
    if (products[currentCategory]) {
      const filteredProducts = products[currentCategory].filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
  
      filteredProducts.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "col-md-4 mb-3";
        productCard.innerHTML = `
                  <div class="card product-card align-items-center" id="product-${index}">
                      <img src="${product.img}" class="card-img-top" alt="${
          product.name
        }">
                      <div class="card-body">
                          <h5 class="card-title">${product.name}</h5>
                          <p class="card-text product-price">LKR ${product.price.toFixed(
                            2
                          )}</p>
                      </div>
                  </div>
              `;
        productListContainer.appendChild(productCard);
        document
          .getElementById(`product-${index}`)
          .addEventListener("click", () => addToOrderList(index));
      });
    }
  }
  
  document.getElementById("search-bar").addEventListener("input", searchProducts);
  
  document
    .getElementById("btnAddCustomerSubmit")
    .addEventListener("click", addCustomer);
  
  function addCustomer(event) {
    event.preventDefault();
    const customerID = getCustomers().length + 1;
    const firstName = document.getElementById("modalFirstName").value;
    const lastName = document.getElementById("modalLastName").value;
    const occupation = document.getElementById("modalOccupation").value;
    const gender = document.getElementById("modalGender");
    const location = document.getElementById("modalLocation").value;
    const email = document.getElementById("modalEmail").value;
    const phoneNumber = document.getElementById("modalPhoneNumber").value;
    const additionalInfo = document.getElementById(
      "modalAdditionalInfomation"
    ).value;
    const customerGender = gender.options[gender.selectedIndex].text;
  
    let img = "../assets/images/man.png";
    if (customerGender === "Female") {
      img = "../assets/images/girl.png";
    }
  
    if (searchPhoneNumberFromArray(phoneNumber) != -1) {
      alert("Customer Already Exists");
      return;
    }
  
    let tempCustomerArray = {
      customerID: customerID,
      img: img,
      firstName: firstName,
      lastName: lastName,
      occupation: occupation,
      customerGender: customerGender,
      location: location,
      email: email,
      phoneNumber: phoneNumber,
      additionalInfo: additionalInfo,
    };
    setCustomer(tempCustomerArray);
    alert("Customer Added Successfully");
    updateOrderID();
    clearCustomerForm();
  }
  
  document
    .getElementById("btnClear")
    .addEventListener("click", clearCustomerForm);
  
  function clearCustomerForm() {
    console.log("clicked");
  
    document.getElementById("modalFirstName").value = "";
    document.getElementById("modalLastName").value = "";
    document.getElementById("modalOccupation").value = "";
    document.getElementById("modalLocation").value = "";
    document.getElementById("modalEmail").value = "";
    document.getElementById("modalPhoneNumber").value = "";
    document.getElementById("modalAdditionalInfomation").value = "";
  }
  
  function showAddCustomerModal() {
    const myModal = new bootstrap.Modal("#modalAddCustomer");
    myModal.show();
  }
  
  document.getElementById("btnCart").addEventListener("click", showCartModal);
  function showCartModal() {
    const myModal = new bootstrap.Modal("#modalCart");
    myModal.show();
  }
  
  function btnClearClicked() {
    document.getElementById("place_order_customerName").value = "";
    document.getElementById("place_order_location").value = "";
    document.getElementById("place_order_phoneNumber").value = "";
    document.getElementById("additionalNotes").value = "";
    document.getElementById("place_order_phoneNumber").focus();
  }
  
  let currentCategory = "Burgers";
  function renderProductList(category) {
    currentCategory = category;
    const productListContainer = document.getElementById("product-list");
    productListContainer.innerHTML = "";
  
    if (products[category]) {
      products[category].forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "col-md-4 mb-3";
        productCard.innerHTML = `
                  <div class="card product-card align-items-center" id="product-${index}">
                      <img src="${product.img}" class="card-img-top" alt="${
          product.name
        }">
                      <div class="card-body">
                          <h5 class="card-title">${product.name}</h5>
                          <p class="card-text product-price">LKR ${product.price.toFixed(
                            2
                          )}</p>
                      </div>
                  </div>
              `;
        productListContainer.appendChild(productCard);
        document
          .getElementById(`product-${index}`)
          .addEventListener("click", () => addToOrderList(index));
      });
    }
  }
  
  let itemList = [];
  
  function addToOrderList(index) {
    const product = products[currentCategory][index];
    const orderItem = itemList.find((item) => item.itemCode === product.itemCode);
    if (orderItem) {
      orderItem.quantity += 1;
    } else {
      itemList.push({ ...product, quantity: 1 });
    }
    updateOrderList();
  }
  
  function updateOrderList() {
    const orderListContainer = document.getElementById("order-list");
    orderListContainer.innerHTML = "";
  
    let subtotal = 0;
    let totalItems = 0;
    let discount = 0;
    let total = 0;
  
    itemList.forEach((item, index) => {
      if (item.quantity > 0) {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;
        discount += item.price * item.quantity * (item.discount / 100);
  
        const orderItem = document.createElement("div");
        orderItem.className = "order-item d-flex justify-content-between m-3";
        orderItem.innerHTML = `
                <div class="col-5">
                    <p class="m-0">${item.name}</p>
                    <p>${item.itemCode}</p>
                </div>
                <div class="col-3">
                    <button class="btn btn-sm btn-secondary" id="minus-${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-secondary" id="plus-${index}">+</button>
                </div>
                <div class="col-2">
                <p>LKR ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="col-2 text-center">
                <button type="button" class="btnDelete m-1 pb-3" id="delete-${index}"><img src="../assets/icons/delete.svg" alt="Delete"></button>
                </div>
            `;
        orderListContainer.appendChild(orderItem);
  
        document
          .getElementById(`minus-${index}`)
          .addEventListener("click", () => changeQuantity(index, -1));
        document
          .getElementById(`plus-${index}`)
          .addEventListener("click", () => changeQuantity(index, 1));
        document
          .getElementById(`delete-${index}`)
          .addEventListener("click", () => removeItem(index));
      }
    });
  
    document.getElementById("total-items").innerText = totalItems;
    document.getElementById("subtotal").innerText = `LKR ${subtotal.toFixed(2)}`;
  
    document.getElementById("lblDiscount").innerText = `LKR ${discount.toFixed(
      2
    )}`;
    total = subtotal - discount;
    document.getElementById("total").innerText = `LKR ${total.toFixed(2)}`;
  }
  
  function changeQuantity(index, change) {
    orderList[index].quantity += change;
    if (orderList[index].quantity < 0) {
      orderList[index].quantity = 0;
    }
    updateOrderList();
  }
  
  function removeItem(index) {
    orderList[index].quantity = 0;
    updateOrderList();
  }
  
  document
    .getElementById("btnClearAll")
    .addEventListener("click", clearOrderList);
  
  function clearOrderList() {
    orderList.length = 0;
    updateOrderList();
  }
  
  document
    .getElementById("btnPlaceOrder")
    .addEventListener("click", btnPlaceOrderClicked);
  function btnPlaceOrderClicked(event) {
    event.preventDefault();
    console.log("clicked");
  
    const orderID = document.getElementById("orderID").innerHTML;
    const date = document.getElementById("DateandTime").innerHTML;
    const customerName = document.getElementById("place_order_customerName").value;
    const phoneNumber = document.getElementById("place_order_phoneNumber").value;
    const address = document.getElementById("place_order_location").value;
    const additionalNotes = document.getElementById("additionalNotes").value;
    const totalItems = parseFloat(document.getElementById("total-items").innerHTML);
    const subtotal = parseFloat(document.getElementById("subtotal").innerHTML.replace("LKR ", "").trim());
    const discount = parseFloat(document.getElementById("lblDiscount").innerHTML.replace("LKR ", "").trim());
    const total = parseFloat(document.getElementById("total").innerHTML.replace("LKR ", "").trim());
    
    let customerID = "";
    getCustomers().forEach((customer) => {
      if (customer.phoneNumber === phoneNumber) {
        customerID = customer.customerID;
      }
    });
    if (!itemList || itemList.length === 0) {
      console.error("No items found in the order.");
      return;
    }
  
    var docDefinition = {
      content: [
        { text: "Order Details", style: "header" },
        {
          text: `Order ID: ${orderID}`,
          margin: [0, 10, 0, 5],
          style: "orderInfo"
        },
        {
          text: `Customer Name: ${customerName}`,
          margin: [0, 0, 0, 5],
          style: "orderInfo"
        },
        {
          text: `Phone Number: ${phoneNumber}`,
          margin: [0, 0, 0, 5],
          style: "orderInfo"
        },
        {
          text: `Address: ${address}`,
          margin: [0, 0, 0, 15],
          style: "orderInfo"
        },
  
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              [
                { text: "Item", style: "tableHeader" },
                { text: "Quantity", style: "tableHeader" },
                { text: "Price", style: "tableHeader" },
                { text: "Total", style: "tableHeader" }
              ],
            ],
          },
          layout: {
            fillColor: (rowIndex) => rowIndex === 0 ? "#dc6b19" : null,
          }
        },
        {
          text: `Total Items: ${totalItems}`,
          margin: [0, 10, 0, 5],
          style: "summaryText"
        },
        {
          text: `Subtotal: LKR ${subtotal.toFixed(2)}`,
          margin: [0, 0, 0, 5],
          style: "summaryText"
        },
        {
          text: `Discount: LKR ${discount.toFixed(2)}`,
          margin: [0, 0, 0, 5],
          style: "summaryText"
        },
        {
          text: `Total: LKR ${total.toFixed(2)}`,
          style: "total",
          margin: [0, 10, 0, 0]
        },
        {
          text: `Additional Notes: ${additionalNotes}`,
          margin: [0, 10, 0, 5],
          style: "notes"
        }
      ],
      
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
          color: "#dc6b19"
        },
        orderInfo: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
          color: "#333333"
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: "white",
          alignment: "center"
        },
        tableContent: {
          fontSize: 12,
          color: "#333333",
          alignment: "center"
        },
        summaryText: {
          fontSize: 12,
          bold: true,
          color: "#333333"
        },
        total: {
          fontSize: 16,
          bold: true,
          alignment: 'right',
          color: "#dc6b19"
        },
        notes: {
          fontSize: 12,
          italics: true,
          color: "#888888"
        }
      },
    };
  
    itemList.forEach((item) => {
      if (item.quantity > 0) {
        docDefinition.content[5].table.body.push([
          { text: item.name, style: "tableContent" },
          { text: item.quantity.toString(), style: "tableContent" },
          { text: `LKR ${item.price.toFixed(2)}`, style: "tableContent" },
          { text: `LKR ${(item.price * item.quantity).toFixed(2)}`, style: "tableContent" }
        ]);
      }
    });
  
    if (docDefinition.content[5].table.body.length <= 1) {
      console.error("No items to display in the table.");
      return;
    }
  
    const pdfName = orderID + ".pdf";
    pdfMake.createPdf(docDefinition).download(pdfName);

    const newOrder = {
      customerID: customerID,
      customerName: customerName,
      phoneNumber: phoneNumber,
      address: address,
      orderId: orderID,
      items: itemList,
      additionalInfo: additionalNotes,
      date: date,
      totalItems: totalItems,
      subtotal: subtotal,
      discount: discount,
      totalAmount: total,
    };
    
    setOrder(newOrder);
    console.log(newOrder);

    updateOrderID();
    clearOrderList();
    btnClearClicked();
  
    console.log("PDF generation initiated");
  }
  
  
  window.onload = function () {
    dateAndTime();
    updateOrderID();
    renderProductList("Burgers");
    updateOrderList();
  };

  document
    .getElementById("burgers")
    .addEventListener("click", renderProductList.bind(null, "Burgers"));
  
  document
    .getElementById("pasta")
    .addEventListener("click", renderProductList.bind(null, "Pasta"));
  
  document
    .getElementById("submarine")
    .addEventListener("click", renderProductList.bind(null, "Submarines"));
  
  document
    .getElementById("fries")
    .addEventListener("click", renderProductList.bind(null, "Fries"));
  
  document
    .getElementById("chicken")
    .addEventListener("click", renderProductList.bind(null, "Chicken"));
  
  document
    .getElementById("beverages")
    .addEventListener("click", renderProductList.bind(null, "Beverages"));
  