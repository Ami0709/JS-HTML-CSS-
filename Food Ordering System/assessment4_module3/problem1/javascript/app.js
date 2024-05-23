class MenuItem {
  constructor(id, name, category, price, description) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.description = description;
  }
}

class Order {
  constructor(
    orderId,
    customerName,
    itemsOrdered,
    totalPrice,
    orderStatus,
    deliveryAddress,
    orderedDate
  ) {
    this.orderId = orderId;
    this.customerName = customerName;
    this.itemsOrdered = itemsOrdered;
    this.totalPrice = totalPrice;
    this.orderStatus = orderStatus;
    this.deliveryAddress = deliveryAddress;
    this.orderedDate = orderedDate;
  }
}

class Owner {
  constructor(userId) {
    this.userId = userId;
  }
}

class Customer {
  constructor(userId, name, email, phoneNumber, deliveryAddress) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.deliveryAddress = deliveryAddress;
  }
}

//sample data

let menuItems = [
  new MenuItem(
    1,
    "Spaghetti Carbonara",
    "Pasta",
    12.99,
    "Spaghetti with pancetta, eggs, and grated cheese"
  ),
];

let customers = [
  new Customer(1, "Amisha", "amisha@gmail.com", "1234567890", "Patna, Bihar"),
];

let orders = [
  new Order(
    1,
    "Amisha",
    ["Pasta"],
    12.99,
    "Order received",
    "Patna, Bihar",
    "2024/08/12"
  ),
];

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function hideButton() {
  document.getElementById("ad-item").style.display = "none";
  document.getElementById("remove-item").style.display = "none";
}

hideButton();

let ownerList = [{ userId: 123 }, { userId: 456 }];

function removeSpaces(str) {
  return str.trim().replace(/\s+/g, "");
}

async function browseMenu() {
  await delay();
  displayMenu(menuItems);
}

document.querySelector("#browseMenu").addEventListener("click", browseMenu);

function addItems(menuItems) {
  const inputedName = prompt("Enter the Name Of Item You want Add: ");
  const inputedCategory = prompt("Enter the Category Of Item You want Add: ");
  const inputedPrice = prompt("Enter the Price Of Item You want Add: ");
  const inputedDescription = prompt(
    "Enter the Description Of Item You want Add: "
  );
  const newItem = new MenuItem(
    menuItems.length + 1,
    inputedName,
    inputedCategory,
    inputedPrice,
    inputedDescription
  );
  menuItems.push(newItem);
  displayMenu(menuItems);
}
document.getElementById("ad-item").addEventListener("click", (e) => {
  e.preventDefault();
  addItems(menuItems);
  hideButton();
});

function removeItems(menuItems) {
  const inputedId = prompt("Enter the Id Of Item You want Add: ");
  const itemId = parseInt(inputedId);
  menuItems = menuItems.filter((item) => item.id !== itemId);
  displayMenu(menuItems);
}

document.getElementById("remove-item").addEventListener("click", (e) => {
  e.preventDefault();
  removeItems(menuItems);
  hideButton();
});

async function editMenu(userId) {
  await delay();

  let filteredOwnerId = ownerList.filter((val) => {
    return val.userId == userId;
  });
  if (filteredOwnerId.length > 0) {
    document.getElementById("ad-item").style.display = "block";
    document.getElementById("remove-item").style.display = "block";
  } else {
    alert("Invalid Owner Id");
  }
}

document.querySelector("#editMenu").addEventListener("click", (e) => {
  e.preventDefault();
  let ownerId = document.querySelector("#owner-id").value;
  editMenu(ownerId);
});

function updateStatus(userId) {
  let filteredOwnerId = ownerList.filter((val) => {
    return val.userId == userId;
  });
  if (filteredOwnerId.length > 0) {
    let itemId = prompt("Enter Id of Order You want update: ");
    let filteredOrderId = orders.filter((val) => {
      return val.orderId == itemId;
    });

    if (filteredOrderId.length > 0) {
      let updatedStatus = prompt(
        "Enter status (Preparing, Out for delivery or Delivered) : "
      );
      filteredOrderId[0].orderStatus = updatedStatus;
      displayOrder(orders);
    } else {
      alert("This Food Item doesn't exist");
    }
  } else {
    alert("Invalid Owner Id");
  }
}

document.querySelector("#edit-order-status").addEventListener("click", (e) => {
  e.preventDefault();
  let ownerId = document.querySelector("#owner-id2").value;
  updateStatus(ownerId);
});

async function displayMenu(menuItems) {
  await delay();
  const menuDisplay = document.getElementById("menu");

  menuDisplay.innerHTML = "";

  if (menuItems.length === 0) {
    menuDisplay.innerHTML = "<p>No food Items Found</p>";
    return;
  }
  const headingMenu = document.createElement("h2");
  headingMenu.textContent = "Menu";
  const table = document.createElement("table");
  table.innerHTML = `<thead>
  <tr>
  <th>Id</th>
  <th>Name</th>
  <th>Category</th>
  <th>Price</th>
  <th>Description</th>
  </tr>
  </thead>
  <tbody>
  ${menuItems.map(
    (item) => `
  <tr>
  <td>${item.id}</td>
  <td>${item.name}</td>
  <td>${item.category}</td>
  <td>${item.price}</td>
  <td>${item.description}</td>
  </tr>
  `
  )}
  </tbody>
  `;
  menuDisplay.append(headingMenu);
  menuDisplay.append(table);
}

async function placeOrder(items, deliveryAddress) {
  await delay();
  let namecus = prompt("Enter Your Name: ");
  if (items.length === 0 || deliveryAddress.length === 0) {
    alert("Selected Items are not in menu or delivery address is not provided");
  }
  let availableItems = menuItems.filter((item) => {
    return item.name === items;
  });
  let availableItemsLength = removeSpaces(availableItems[0].name).length;
  let orderedItemsLength = removeSpaces(items).length;
  if (availableItemsLength !== orderedItemsLength) {
    throw new Error("Selected Items are not available");
  }

  let orderId = orders.length + 1;
  let totalPrice = 0;
  availableItems.forEach((item) => {
    totalPrice += item.price;
  });
  const todayDate = getTodayDate();
  let newOrder = new Order(
    orderId,
    namecus,
    items,
    totalPrice,
    "Order recieved",
    deliveryAddress,
    todayDate
  );
  orders.push(newOrder);
  console.log(orders);
}

document.getElementById("btnPlaceOrder").addEventListener("click", () => {
  const orderInput = document.getElementById("selectItems").value;
  const inputAddress = document.getElementById("deliveryAddress").value;
  placeOrder(orderInput, inputAddress);
  displayOrder(orders);
});

async function displayOrder(orders) {
  await delay();
  const orderDisplay = document.querySelector(".order-list");

  orderDisplay.innerHTML = "";

  if (orders.length === 0) {
    orderDisplay.innerHTML = "<p>No Orders right now</p>";
    return;
  }
  const header = document.createElement("h2");
  header.textContent = "Orders List";
  const table = document.createElement("table");
  table.innerHTML = `<thead>
  <tr>
  <th>Order Id</th>
  <th>Customer Name</th>
  <th>Item Ordered</th>
  <th>Price</th>
  <th>Order Status</th>
  <th>Delivery address</th>
  </tr>
  </thead>
  <tbody>
  ${orders.map(
    (item) => `
  <tr>
  <td>${item.orderId}</td>
  <td>${item.customerName}</td>
  <td>${item.itemsOrdered}</td>
  <td>${item.totalPrice}</td>
  <td>${item.orderStatus}</td>
  <td>${item.deliveryAddress}</td>
  </tr>
  `
  )}
  </tbody>
  `;
  orderDisplay.append(header);
  orderDisplay.append(table);
}
displayOrder(orders);

async function trackOrderStatus(orderId) {
  try {
    await delay();

    let order = orders.find((order) => order.orderId == orderId);
    if (!order) {
      throw new Error("order not found");
    }
    alert(`order ${order.orderId} status: ${order.orderStatus}`);
  } catch (err) {
    alert("Error in tracking order status: " + err.message);
  }
}

document.getElementById("btnOrderStatus").addEventListener("click", () => {
  let orderIdcus = document.getElementById("orderId").value;
  trackOrderStatus(orderIdcus);
});

async function viewOrders(startDate, endDate) {
  try {
    await delay();

    let dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error("Invalid Date format. Use yyyy/mm/dd");
    }

    let start = new Date(startDate);
    let end = new Date(endDate);

    let filteredOrder = orders.filter((order) => {
      let orderDate = new Date(order.orderedDate);
      return orderDate >= start && orderDate <= end;
    });
    if (filteredOrder.length > 0) {
      let orderTableList = document.querySelector("#viewing-order");
      let table = document.createElement("table");
      table.innerHTML = `<thead>
      <tr>
        <th>Order ID</th>
        <th>Customer Name</th>
        <th>Items Ordered</th>
        <th>Total Price</th>
        <th>Order Status</th>
      </tr>
    </thead>
    <tbody>`;
      filteredOrder.forEach((val) => {
        table.innerHTML += `
    <tr>
      <td>${val.orderId}</td>
      <td>${val.customerName}</td>
      <td>${val.itemsOrdered}</td>
      <td>${val.totalPrice}</td>
      <td>${val.orderStatus}</td>
    </tr>`;
      });
      table.innerHTML += `</tbody>`;
      orderTableList.innerHTML = "";
      orderTableList.append(table);
    }
  } catch (error) {
    alert("Error viewing orders: " + error.message);
  }
}

document.getElementById("viewStatus").addEventListener("click", () => {
  let startadate1 = document.querySelector("#startDate").value;
  let endadate2 = document.querySelector("#endDate").value;
  viewOrders(startadate1, endadate2);
});
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
