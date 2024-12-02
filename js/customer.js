import { deleteCustomerFromArray, getCustomers, setCustomer } from "./data.js";

let customers = getCustomers();

console.log(customers);

document
  .getElementById("btnAddCustomer")
  .addEventListener("click", showAddCustomerModal);

function showAddCustomerModal() {
  const myModal = new bootstrap.Modal("#modalAddCustomer");
  myModal.show();
}

function renderCustomerList() {
  const customerListContainer = document.getElementById("customer-list");
  customerListContainer.innerHTML = "";

  if (customers) {
    customers.forEach((customer, index) => {
      console.log(customer);

      const customerCard = document.createElement("div");
      customerCard.className = "col-lg-3 col-md-4 col-sm-12 mb-3 mt-4";
      customerCard.innerHTML = `
                <div class="card customer-card align-items-center">
                    <img src="${customer.img}" class="card-img-top" alt="${customer.name}">
                    <div class="card-body">
                        <h5 class="card-title">${customer.firstName} ${customer.lastName}</h5>
                        <p class="card-text">${customer.phoneNumber}</p>
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
      customerListContainer.appendChild(customerCard);

      document
        .getElementById(`btnView-${index}`)
        .addEventListener("click", () => loadCustomerDetails(index));
      document
        .getElementById(`btnEdit-${index}`)
        .addEventListener("click", () => loadCustomerToModal(index));
      document
        .getElementById(`btnDelete-${index}`)
        .addEventListener("click", () => deleteCustomer(index));
    });
  }
}

function loadCustomerDetails(index) {
  const customer = customers[index];

  if (customer) {
    document.getElementById("viewCustomerImage").src = customer.img;
    document.getElementById("viewCustomerID").textContent = customer.customerID;
    document.getElementById("viewCustomerFirstName").textContent =
      customer.firstName;
    document.getElementById("viewCustomerLastName").textContent =
      customer.lastName;
    document.getElementById("viewCustomerOccupation").textContent =
      customer.occupation;
    document.getElementById("viewCustomerLocation").textContent =
      customer.location;
    document.getElementById("viewCustomerEmail").textContent = customer.email;
    document.getElementById("viewCustomerPhone").textContent =
      customer.phoneNumber;
    document.getElementById("viewCustomerAdditionalInfo").textContent =
      customer.additionalInfo;

    document.getElementById("viewCustomerGender").textContent = customer.gender;

    new bootstrap.Modal(document.getElementById("modalViewCustomer")).show();
  } else {
    console.error("Customer not found");
  }
}

function loadCustomerToModal(index) {
  const customer = customers[index];

  const customerID = customers.length + 1;
  const firstName = (document.getElementById("modalFirstName").value =
    customer.firstName);
  const lastName = (document.getElementById("modalLastName").value =
    customer.lastName);
  const occupation = (document.getElementById("modalOccupation").value =
    customer.occupation);
  const gender = (document.getElementById("modalGender").value =
    customer.gender);
  const location = (document.getElementById("modalLocation").value =
    customer.location);
  const email = (document.getElementById("modalEmail").value = customer.email);
  const phoneNumber = (document.getElementById("modalPhoneNumber").value =
    customer.phoneNumber);
  const additionalInfo = (document.getElementById(
    "modalAdditionalInfomation"
  ).value = customer.additionalInfo);

  const customerModal = new bootstrap.Modal("#modalAddCustomer");
  customerModal.show();
}

function searchCustomers() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const customerListContainer = document.getElementById("customer-list");
  customerListContainer.innerHTML = "";

  if (customers) {
    const filteredCustomers = customers.filter((customer) =>
      customer.phoneNumber.toLowerCase().includes(searchTerm)
    );

    filteredCustomers.forEach((customer, index) => {
      const customerCard = document.createElement("div");
      customerCard.className = "col-lg-3 col-md-4 col-sm-12 mb-3 mt-4";
      customerCard.innerHTML = `
                  <div class="card customer-card align-items-center">
                      <img src="${customer.img}" class="card-img-top" alt="${customer.name}">
                      <div class="card-body">
                          <h5 class="card-title">${customer.firstName} ${customer.lastName}</h5>
                          <p class="card-text">${customer.phoneNumber}</p>
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
      customerListContainer.appendChild(customerCard);

      document
        .getElementById(`btnView-${index}`)
        .addEventListener("click", () => loadCustomerDetails(index));
      document
        .getElementById(`btnEdit-${index}`)
        .addEventListener("click", () => loadCustomerToModal(index));
      document
        .getElementById(`btnDelete-${index}`)
        .addEventListener("click", () => deleteCustomer(index));
    });
  }
}

document
  .getElementById("search-bar")
  .addEventListener("input", searchCustomers);

document
  .getElementById("btnAddCustomerSubmit")
  .addEventListener("click", addNewCustomer);

function addNewCustomer(event) {
  event.preventDefault();
  const customerID = customers.length + 1;
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

  for (let i = 0; i < customers.length; i++) {
    if (customers[i].phoneNumber === phoneNumber) {
      deleteCustomer(i);
    }
  }

  let tempCustomerArray = {
    customerID: customerID,
    img: img,
    firstName: firstName,
    lastName: lastName,
    occupation: occupation,
    gender: customerGender,
    location: location,
    email: email,
    phoneNumber: phoneNumber,
    additionalInfo: additionalInfo,
  };

  console.log(tempCustomerArray);

  setCustomer(tempCustomerArray);
  renderCustomerList();

  alert("Customer Added Successfully");

  const myModal = new bootstrap.Modal("#modalAddProduct");
  myModal.hide();
}

function showSuccessModal() {
  const successModal = new bootstrap.Modal(
    document.getElementById("successAlertModal")
  );
  successModal.show();
}

function updateCustomerList(newCustomer, index) {
  const customerListContainer = document.getElementById("customer-list");
  const customerCard = document.createElement("div");

  customerCard.className = "col-lg-3 col-md-4 col-sm-12 mb-3 mt-4";
  customerCard.innerHTML = `
                  <div class="card customer-card align-items-center">
                      <img src="${newCustomer.img}" class="card-img-top" alt="${newCustomer.name}">
                      <div class="card-body">
                          <h5 class="card-title">${newCustomer.firstName} ${newCustomer.lastName}</h5>
                          <p class="card-text">${newCustomer.phoneNumber}</p>
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
  customerListContainer.appendChild(customerCard);

  document
    .getElementById(`btnView-${index}`)
    .addEventListener("click", () => loadCustomerDetails(index));
  document
    .getElementById(`btnEdit-${index}`)
    .addEventListener("click", () => loadCustomerToModal(index));
  document
    .getElementById(`btnDelete-${index}`)
    .addEventListener("click", () => deleteCustomer(index));

  showSuccessModal();
}

function deleteCustomer(index) {
  deleteCustomerFromArray(index);
  renderCustomerList();
}

window.onload = function () {
  renderCustomerList();
};
