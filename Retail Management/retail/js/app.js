document.addEventListener('DOMContentLoaded', function() {
    const addInventoryForm = document.getElementById('addProductForm');
    const itemListTableBody = document.getElementById('itemListTableBody')
    const updateInventoryForm = document.querySelector("updateInventoryForm");
    const updateItemListTableBody = document.getElementById('updateItemListTableBody');
    const viewItemListTableBody = document.getElementById('viewItemListTableBody');
    const viewCategoryForm = document.getElementById('viewCategoryForm');

    addInventoryForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const itemName = document.getElementById('itemName').value;
        const itemCategory = document.getElementById('itemCategory').value;
        const itemQuantity = document.getElementById('itemQuantity').value;
        const itemPrice = document.getElementById('itemPrice').value;

        if (!itemName || !itemCategory || !itemQuantity || !itemPrice) {
            alert("Please fill in all fields.");
            return;
        }

        const newProduct = new Product(
            inventory.products.length + 1,
            itemName,
            itemCategory,
            itemQuantity,
            itemPrice
        )

        try {
            inventory.addInventoryItem(newProduct);
            inventory.updateItemListTableBody();
            localStorage.setItem('Inventory', JSON.stringify(inventory.products));
        } catch (error) {
            alert(error.message);
        }
        addInventoryForm.reset();
    })
    const storedInventory = localStorage.getItem('Inventory');
    if (storedInventory) {
        inventory.products = JSON.parse(storedInventory);
        inventory.updateItemListTableBody();
    }

    const button = document.getElementById('updateBtn');
    button.addEventListener('click', function(event){
        event.preventDefault();

        const updateItemId = document.getElementById('updateItemId').value;
        const newPrice = document.getElementById('newPrice').value;

        if (!updateItemId || !newPrice) {
            alert("Please fill in all fields.");
            return;
        }
        const updateProduct = new NewProduct(updateItemId, newPrice)

        try {
            inventory.updateInventoryPrice(updateProduct);
            inventory.updatedItemListTable();
            localStorage.setItem('Inventory', JSON.stringify(inventory));
        } catch(err){
            alert(err.message);
        }
        updateInventoryForm.reset();
    })

    const viewBtn = document.getElementById('viewInventory');
    viewBtn.addEventListener('click', function(event){
        event.preventDefault(); 

        const viewCategory = document.getElementById('viewCategory').value;
        if (!viewCategory){
            alert('Please fill in all fields');
            return;
        }
        const viewProduct = new ViewCategory(viewCategory);
        try {
            inventory.viewInventoryByCategory(viewProduct);
        } catch (err) {
            alert(err.message);
        }
        viewCategoryForm.reset();
    });

    window.addEventListener('unload', function() {
        // Clear all data stored in local storage
        localStorage.clear();
    });
})

class Product {
    constructor(id, itemName, itemCategory, itemQuantity, itemPrice) {
        this.id = id;
        this.itemName = itemName;
        this.itemCategory = itemCategory;
        this.itemQuantity = itemQuantity;
        this.itemPrice = itemPrice;
    }
}

class NewProduct {
    constructor(updateItemId, newPrice){
        this.updateItemId = updateItemId;
        this.newPrice = newPrice;
    }
}

class ViewCategory {
    constructor(viewCategory){
        this.viewCategory = viewCategory;
    }
}

class Inventory {
    constructor() {
        this.products = [];
    }


    addInventoryItem(product) {
        if (product.itemQuantity < 0) {
            throw new Error("Item quantity must be greater than 0");
        }
        this.products.push(product);
        setTimeout(() => {
            alert("Inventory added successfully");
        }, 1000);
    }

    updateInventoryPrice(product) {
        inventory.products.forEach(item => {
            if(item.id == parseInt(product.updateItemId,10)){
                item.itemPrice = product.newPrice;
            }
        });
    }

    viewInventoryByCategory(product) {
        inventory.products.forEach(item => {
            if (item.itemCategory == product.viewCategory){

            }
        })
    }

    updateItemListTableBody() {
        const itemListTableBody = document.getElementById('itemListTableBody');
        itemListTableBody.innerHTML = '';
    
        this.products.forEach(product => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${product.id}</td>
                <td>${product.itemName}</td>
                <td>${product.itemCategory}</td>
                <td>${product.itemQuantity}</td>
                <td>${product.itemPrice}</td>
            `;
            itemListTableBody.appendChild(newRow);
        });
    }

    updatedItemListTable(){
        const updateItemListTableBody = document.getElementById('updateItemListTableBody');
        updateItemListTableBody.innerHTML = '';

        this.products.forEach(product => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${product.id}</td>
                <td>${product.itemName}</td>
                <td>${product.itemPrice}</td>
            `;
            updateItemListTableBody.appendChild(newRow);
        })
    }
}
const inventory = new Inventory();

function generateReport() {
    // Create a table element
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Item ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Supplier Name</th>
                <th>Contact Info</th>
                <th>Email</th>
                <th>Phone Number</th>
            </tr>
        </thead>
        <tbody id="report-body">
            
        </tbody>
    `;

    // Populate table with inventory items and supplier details
    const tbody = table.querySelector("#report-body");
    inventory.forEach(item => {
        const supplier = suppliers.find(supplier => supplier.supplierId === item.supplierId);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.itemId}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${supplier.name}</td>
            <td>${supplier.contactInfo}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phoneNumber}</td>
        `;
        tbody.appendChild(row);
    });

    // Append the table to the document body
    document.body.appendChild(table);
}

// Example usage:
generateReport();