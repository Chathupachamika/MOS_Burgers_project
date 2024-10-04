document.addEventListener("DOMContentLoaded", function() {

    const homeIcon = document.getElementById("homeIcon");
    const dashboardIcon = document.getElementById("dashboardIcon");
    const ordersIcon = document.getElementById("ordersIcon");
    const productsIcon = document.getElementById("productsIcon");
    const customersIcon = document.getElementById("customersIcon");

    // Event listeners to load corresponding pages
    homeIcon.addEventListener("click", () => loadPage("home"));
    dashboardIcon.addEventListener("click", () => loadPage("dashboard"));
    ordersIcon.addEventListener("click", () => loadPage("orders"));
    productsIcon.addEventListener("click", () => loadPage("products"));
    customersIcon.addEventListener("click", () => loadPage("customers"));
});

function loadPage(page) {
    const content = document.getElementById("content");
    content.innerHTML = ''; // Clear content before loading new page

    switch(page) {
        case "home":
            loadTemplate('homeTemplate', content);
            break;
        case "dashboard":
            loadTemplate('dashboardTemplate', content);
            loadDashboardPageScripts();
            break;
        case "orders":
            loadTemplate('ordersTemplate', content);
            loadOrdersPageScripts();
            break;
        case "products":
            loadTemplate('productsTemplate', content);
            loadProductsPageScripts();
            break;
        case "customers":
            loadTemplate('customersTemplate', content);
            break;
    }
}

// Utility function to load a template and append to content
function loadTemplate(templateId, content) {
    const template = document.getElementById(templateId).content.cloneNode(true);
    content.appendChild(template);
}

// Function for loading orders page scripts
function loadOrdersPageScripts() {
    const menuItems = getMenuItems();
    populateMenuTable(menuItems, 'productsTable');
    
    let billItems = [];
    
    // Add item to bill logic
    function addItemToBill() {
        const itemCode = document.getElementById('billItemCode').value;
        const itemQty = parseInt(document.getElementById('billItemQty').value, 10);
        const menuItem = menuItems.find(item => item.code === itemCode);

        if (menuItem && itemQty > 0) {
            const existingItem = billItems.find(item => item.code === itemCode);
            if (existingItem) {
                existingItem.qty += itemQty;
            } else {
                billItems.push({ ...menuItem, qty: itemQty });
            }
            updateBillSummary();
        } else {
            alert('Invalid item code or quantity.');
        }
    }

    // Remove item from bill
    function removeItem() {
        const itemCode = document.getElementById('billItemCode').value;
        billItems = billItems.filter(item => item.code !== itemCode);
        updateBillSummary();
    }

    // Update bill summary
    function updateBillSummary() {
        const billItemsTable = document.getElementById('billItemsTable');
        billItemsTable.innerHTML = '';
        let subtotal = 0, totalDiscount = 0;

        billItems.forEach(item => {
            const itemTotal = item.price * item.qty;
            let itemDiscount = 0;
            if (item.discount !== '-') {
                const discountPercent = parseFloat(item.discount.replace('%', ''));
                itemDiscount = (itemTotal * discountPercent) / 100;
            }
            subtotal += itemTotal;
            totalDiscount += itemDiscount;

            const row = `<tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>${item.discount}</td>
            </tr>`;
            billItemsTable.innerHTML += row;
        });

        const total = subtotal - totalDiscount;
        document.getElementById('subtotalDisplay').innerText = subtotal.toFixed(2);
        document.getElementById('totalDiscountDisplay').innerText = totalDiscount.toFixed(2);
        document.getElementById('totalDisplay').innerText = total.toFixed(2);
    }

    // Populate bill item details on item code input
    document.getElementById('billItemCode').addEventListener('input', () => {
        const itemCode = document.getElementById('billItemCode').value;
        const menuItem = menuItems.find(item => item.code === itemCode);

        if (menuItem) {
            document.getElementById('billItemName').value = menuItem.name;
            document.getElementById('billItemPrice').value = menuItem.price.toFixed(2);
            document.getElementById('billItemDiscount').value = menuItem.discount;
        } else {
            document.getElementById('billItemName').value = '';
            document.getElementById('billItemPrice').value = '';
            document.getElementById('billItemDiscount').value = '';
        }
    });

    // Expose functions to the template
    window.addItemToBill = addItemToBill;
    window.removeItem = removeItem;

    // Event listener to print bill
    document.getElementById('displayBill').addEventListener('click', () => {
        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const customerPhone = document.getElementById('customerPhone').value;

        if (customerName && customerEmail && customerPhone && billItems.length > 0) {
            alert('Bill has been printed and added to the customer record.');
            billItems = [];
            updateBillSummary();
        } else {
            alert('Please fill out customer details and add items to the bill.');
        }
    });
}

// Function to load products page scripts
function loadProductsPageScripts() {
    const menuItems = getMenuItems();
    populateMenuTable(menuItems, 'productsTable');
}

// Utility function to get menu items
function getMenuItems() {
    return [
        { code: 'B1001', name: 'Classic Burger (Large)', price: 750.00, discount: '-' },
        { code: 'B1002', name: 'Classic Burger (Regular)', price: 1500.00, discount: '15%' },
        { code: 'B1003', name: 'Turkey Burger', price: 1600.00, discount: '-' },
        { code: 'B1004', name: 'Chicken Burger (Large)', price: 1400.00, discount: '-' },
        { code: 'B1005', name: 'Chicken Burger (Regular)', price: 800.00, discount: '20%' },
        { code: 'B1006', name: 'Cheese Burger (Large)', price: 1000.00, discount: '-' },
        { code: 'B1007', name: 'Cheese Burger (Regular)', price: 600.00, discount: '-' },
        { code: 'B1008', name: 'Bacon Burger', price: 650.00, discount: '15%' },
        { code: 'B1009', name: 'Shawarma Burger', price: 800.00, discount: '-' },
        { code: 'B1010', name: 'Olive Burger', price: 1800.00, discount: '-' },
        { code: 'B1012', name: 'Double-Cheese Burger', price: 1250.00, discount: '20%' },
        { code: 'B1013', name: 'Crispy Chicken Burger (Regular)', price: 1200.00, discount: '-' },
        { code: 'B1014', name: 'Crispy Chicken Burger (Large)', price: 1600.00, discount: '10%' },
        { code: 'B1015', name: 'Paneer Burger', price: 900.00, discount: '-' },
        // Submarines
        { code: 'B1016', name: 'Crispy Chicken Submarine (Large)', price: 2000.00, discount: '-' },
        { code: 'B1017', name: 'Crispy Chicken Submarine (Regular)', price: 1500.00, discount: '-' },
        { code: 'B1018', name: 'Chicken Submarine (Large)', price: 1800.00, discount: '3%' },
        { code: 'B1019', name: 'Chicken Submarine (Regular)', price: 1400.00, discount: '-' },
        { code: 'B1020', name: 'Grinder Submarine', price: 2300.00, discount: '-' },
        { code: 'B1021', name: 'Cheese Submarine', price: 2200.00, discount: '-' },
        { code: 'B1022', name: 'Double Cheese n Chicken Submarine', price: 1900.00, discount: '16%' },
        { code: 'B1023', name: 'Special Horgie Submarine', price: 2800.00, discount: '-' },
        { code: 'B1024', name: 'MOS Special Submarine', price: 3000.00, discount: '-' },
        // Fries
        { code: 'B1025', name: 'Steak Fries (Large)', price: 1200.00, discount: '-' },
        { code: 'B1026', name: 'Steak Fries (Medium)', price: 600.00, discount: '-' },
        { code: 'B1027', name: 'French Fries (Large)', price: 800.00, discount: '-' },
        { code: 'B1028', name: 'French Fries (Medium)', price: 650.00, discount: '-' },
        { code: 'B1029', name: 'French Fries (Small)', price: 450.00, discount: '-' },
        { code: 'B1030', name: 'Sweet Potato Fries (Large)', price: 600.00, discount: '-' },
        // Pasta
        { code: 'B1031', name: 'Chicken n Cheese Pasta', price: 1600.00, discount: '15%' },
        { code: 'B1032', name: 'Chicken Penne Pasta', price: 1700.00, discount: '-' },
        { code: 'B1033', name: 'Ground Turkey Pasta Bake', price: 2900.00, discount: '10%' },
        { code: 'B1034', name: 'Creamy Shrimp Pasta', price: 2000.00, discount: '-' },
        { code: 'B1035', name: 'Lemon Butter Pasta', price: 1950.00, discount: '-' },
        { code: 'B1036', name: 'Tagliatelle Pasta', price: 2400.00, discount: '1%' },
        { code: 'B1037', name: 'Baked Ravioli', price: 2000.00, discount: '1%' },
        // Chicken
        { code: 'B1038', name: 'Fried Chicken (Small)', price: 1200.00, discount: '-' },
        { code: 'B1039', name: 'Fried Chicken (Regular)', price: 2300.00, discount: '10%' },
        { code: 'B1040', name: 'Fried Chicken (Large)', price: 3100.00, discount: '5%' },
        { code: 'B1041', name: 'Hot Wings (Large)', price: 2400.00, discount: '-' },
        { code: 'B1042', name: 'Devilled Chicken (Large)', price: 900.00, discount: '-' },
        { code: 'B1043', name: 'BBQ Chicken (Regular)', price: 2100.00, discount: '-' },
        // Beverages
        { code: 'B1044', name: 'Pepsi (330ml)', price: 990.00, discount: '5%' },
        { code: 'B1045', name: 'Coca-Cola (330ml)', price: 1230.00, discount: '-' },
        { code: 'B1046', name: 'Sprite (330ml)', price: 1500.00, discount: '3%' },
        { code: 'B1047', name: 'Mirinda (330ml)', price: 850.00, discount: '7%' }
    ];
}
// Utility function to populate table with menu items
function populateMenuTable(items, tableId) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    items.forEach(item => {
        const row = `<tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.discount}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

function loadDashboardPageScripts() {
    // Sample data for dashboard statistics
    const salesData = [
        { month: 'January', sales: 12000 },
        { month: 'February', sales: 15000 },
        { month: 'March', sales: 13000 },
        { month: 'April', sales: 16000 },
        { month: 'May', sales: 18000 },
        { month: 'June', sales: 20000 },
        { month: 'July', sales: 22000 },
        { month: 'August', sales: 25000 },
        { month: 'September', sales: 24000 },
        { month: 'October', sales: 23000 },
        { month: 'November', sales: 21000 },
        { month: 'December', sales: 26000 },
    ];

    const customerData = [
        { name: 'John Doe', orders: 15 },
        { name: 'Jane Smith', orders: 12 },
        { name: 'Sam Green', orders: 20 },
        { name: 'Lisa Brown', orders: 18 },
        { name: 'Michael Johnson', orders: 25 },
    ];

    // Clear existing content
    const content = document.getElementById("content");
    content.innerHTML = '';

    // Add dashboard title
    const dashboardTitle = document.createElement("h2");
    dashboardTitle.textContent = "Dashboard Overview";
    content.appendChild(dashboardTitle);

    // Sales Summary Section
    const salesSummary = document.createElement("div");
    salesSummary.className = "dashboard-section";
    salesSummary.innerHTML = `<h3>Sales Summary</h3>`;
    
    const salesList = document.createElement("ul");
    salesData.forEach(data => {
        const listItem = document.createElement("li");
        listItem.textContent = `${data.month}: LKR ${data.sales.toLocaleString()}`;
        salesList.appendChild(listItem);
    });
    
    salesSummary.appendChild(salesList);
    content.appendChild(salesSummary);

    // Customer Summary Section
    const customerSummary = document.createElement("div");
    customerSummary.className = "dashboard-section";
    customerSummary.innerHTML = `<h3>Top Customers</h3>`;
    
    const customerList = document.createElement("ul");
    customerData.forEach(customer => {
        const listItem = document.createElement("li");
        listItem.textContent = `${customer.name}: ${customer.orders} orders`;
        customerList.appendChild(listItem);
    });
    
    customerSummary.appendChild(customerList);
    content.appendChild(customerSummary);

    // Sales Distribution Chart (Bar Chart)
    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    chartContainer.innerHTML = `<h3>Sales Distribution</h3>`;
    const salesChartCanvas = document.createElement("canvas");
    chartContainer.appendChild(salesChartCanvas);
    content.appendChild(chartContainer);

    // Check for Chart.js and render the bar chart
    if (typeof Chart !== "undefined") {
        const chartLabels = salesData.map(data => data.month);
        const chartValues = salesData.map(data => data.sales);

        const salesChart = new Chart(salesChartCanvas, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Monthly Sales (LKR)',
                    data: chartValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        console.warn("Chart.js is not loaded.");
    }

    // Sales Distribution Pie Chart
    const pieChartContainer = document.createElement("div");
    pieChartContainer.className = "chart-container";
    pieChartContainer.innerHTML = `<h3>Sales Distribution (Pie Chart)</h3>`;
    const salesPieChartCanvas = document.createElement("canvas");
    pieChartContainer.appendChild(salesPieChartCanvas);
    content.appendChild(pieChartContainer);

    // Render Pie Chart
    if (typeof Chart !== "undefined") {
        const salesPieChart = new Chart(salesPieChartCanvas, {
            type: 'pie',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Sales Distribution',
                    data: chartValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Sales Distribution by Month'
                    }
                }
            }
        });
    } else {
        console.warn("Chart.js is not loaded.");
    }
}

function setActiveIcon(iconId) {
    const icons = document.querySelectorAll('nav ul li');
    icons.forEach(icon => {
        if (icon.id === iconId) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

// Array to hold customer records
let customerRecords = [];

// Function to add items to the bill
function addItemToBill() {
    // Logic to add items to the bill (retrieve from form, add to bill summary)
}

// Function to print the bill and display success message
function printBill() {
    // Get customer details
    const customerName = document.getElementById("customerName").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerPhone = document.getElementById("customerPhone").value;

    // Logic to gather the bill data (bill items, subtotal, etc.)
    // Simulate adding customer to the customer record
    customerRecords.push({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        // Add item details (assuming one item for simplicity)
        items: [
            {
                name: "Sample Item",
                qty: 1,
                total: 500
            }
        ]
    });

    // Display the success message
    document.getElementById("billMessage").style.display = "block";
}

// Function to view customer records
function viewCustomerRecord() {
    // Populate customer records table
    const tableBody = document.getElementById("customerRecordsTable");
    tableBody.innerHTML = ''; // Clear the table before populating

    customerRecords.forEach(record => {
        const row = document.createElement('tr');

        // Assuming one item per customer for simplicity
        const item = record.items[0];

        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${record.phone}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.total} LKR</td>
        `;

        tableBody.appendChild(row);
    });

    // Navigate to customer record template
    document.body.innerHTML = document.getElementById("customerRecordTemplate").innerHTML;
}
const services = [
    { code: 'S001', name: 'Delivery', description: 'Fast and reliable delivery to your doorstep.', price: 500 },
    { code: 'S002', name: 'Catering', description: 'Catering services for events and parties.', price: 1500 },
    { code: 'S003', name: 'Online Ordering', description: 'Order online and enjoy great discounts.', price: 0 },
    { code: 'S004', name: 'Takeaway', description: 'Convenient takeaway options available.', price: 0 },
];

const servicesTable = document.getElementById('servicesTable');

services.forEach(service => {
    const row = `<tr>
        <td>${service.code}</td>
        <td>${service.name}</td>
        <td>${service.description}</td>
        <td>${service.price}</td>
    </tr>`;
    servicesTable.innerHTML += row;
});
