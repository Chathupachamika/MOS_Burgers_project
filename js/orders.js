import { getOrders } from "./data.js";

let orderList = getOrders();

function showOrderDetailsModal() {
  const myModal = new bootstrap.Modal("#orderDetailsModal");
  myModal.show();
}

function renderOrderTable() {
  const tableBody = document.querySelector(".table-body tbody");
  tableBody.innerHTML = "";

  orderList.forEach((order) => {
    console.log(order);

    const row = document.createElement("tr");

    order.img = "../assets/images/man.png";
    row.innerHTML = `
      <td>${order.orderId}</td>
      <td><img src="${order.img}" alt="">${order.customerName}</td>
      <td>${order.phoneNumber}</td>
      <td>${order.date}</td>
      <td><p class="status completed">Completed</p></td>
      <td><strong>LKR ${parseFloat(order.totalAmount).toFixed(2)}</strong></td>
      <td><a href="#" class="view" data-order-id="${
        order.orderId
      }" data-bs-toggle="modal" data-bs-target="#orderDetailsModal">View</a></td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll(".view").forEach((button) => {
    button.addEventListener("click", function () {
      const orderId = this.getAttribute("data-order-id");
      const order = orderList.find((o) => o.orderId === orderId);

      if (order) {
        document.getElementById("modalOrderID").innerText = order.orderId;
        document.getElementById("modalOrderDate").innerText = order.date;
        document.getElementById("modalCustomerName").innerText =
          order.customerName;
        document.getElementById("modalCustomerContact").innerText =
          order.phoneNumber;
        document.getElementById("modalOrderTotal").innerText =
          "LKR " + parseFloat(order.totalAmount).toFixed(2);
        document.getElementById("modalOrderStatus").innerText = "Completed";

        const modalOrderItems = document.getElementById("modalOrderItems");
        modalOrderItems.innerHTML = "";

        order.items.forEach((item) => {
          const row = `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>LKR ${item.price.toFixed(2)}</td>
              <td>LKR ${(item.quantity * item.price).toFixed(2)}</td>
            </tr>`;
          modalOrderItems.insertAdjacentHTML("beforeend", row);
        });
      }
    });
  });

  showOrderDetailsModal();
}

window.onload = function () {
  renderOrderTable();
};

// Searching for specific data
const search = document.getElementById("search-bar");
search.addEventListener("input", searchTable);

function searchTable() {
  const table_rows = document.querySelectorAll(".table-body tbody tr");
  const searchValue = search.value.toLowerCase();
  let rowCount = 0;

  table_rows.forEach((row) => {
    let tableData = row.textContent.toLowerCase();
    const isMatch = tableData.includes(searchValue);

    row.classList.toggle("hide", !isMatch);

    if (isMatch) {
      rowCount++;
      row.style.backgroundColor =
        rowCount % 2 === 0 ? "#f2f2f2" : "transparent";
    } else {
      row.style.backgroundColor = "";
    }
  });
}
//Converting HTML table to PDF

const pdf_btn = document.querySelector("#toPDF");
const customers_table = document.querySelector("#customers_table");

const toPDF = function (customers_table) {
  const html_code = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Print PDF</title>
      <link rel="stylesheet" type="text/css" href="../css/styles.css">
      <link rel="stylesheet" type="text/css" href="../css/orders.css">
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <main class="table" id="customers_table">
        ${customers_table.innerHTML}
      </main>
    </body>
    </html>`;

  const new_window = window.open("", "_blank", "width=800,height=600");

  new_window.document.write(html_code);
  new_window.document.close();
  new_window.focus();

  setTimeout(() => {
    new_window.print();
    new_window.close();
  }, 500);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.autoTable({
    html: customers_table,
    startY: 10,
    styles: {
      cellPadding: 3,
      fontSize: 8,
      valign: "middle",
      halign: "center",
      overflow: "linebreak",
    },
  });

  doc.save("OrderDetails.pdf");
};

pdf_btn.onclick = () => {
  toPDF(customers_table);
};

//Converting HTML table to EXCEL File

const excel_btn = document.querySelector("#toEXCEL");

const toExcel = function (table) {
  const t_heads = table.querySelectorAll("th"),
    tbody_rows = table.querySelectorAll("tbody tr");

  const headings =
    [...t_heads]
      .map((head) => {
        let actual_head = head.textContent.trim().split(" ");
        return actual_head
          .splice(0, actual_head.length - 1)
          .join(" ")
          .toLowerCase();
      })
      .join("\t") +
    "\t" +
    "image name";

  const table_data = [...tbody_rows]
    .map((row) => {
      const cells = row.querySelectorAll("td"),
        img = decodeURIComponent(row.querySelector("img").src),
        data_without_img = [...cells]
          .map((cell) => cell.textContent.trim())
          .join("\t");

      return data_without_img + "\t" + img;
    })
    .join("\n");

  return headings + "\n" + table_data;
};

excel_btn.onclick = () => {
  const excel = toExcel(customers_table);
  downloadFile(excel, "excel");
};

const downloadFile = function (data, fileType, fileName = "") {
  const a = document.createElement("a");
  a.download = fileName;
  const mime_types = {
    json: "application/json",
    csv: "text/csv",
    excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
