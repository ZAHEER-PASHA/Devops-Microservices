const token = localStorage.getItem("token");

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {


alert("Please login first.");

window.location.href = "/";


}

// ==========================================
// API
// ==========================================

const PRODUCT_API = "/api/products";
const ORDER_API = "/api/orders";

// ==========================================
// ELEMENTS
// ==========================================

const productContainer =
document.getElementById("productContainer");

const ordersBtn =
document.getElementById("ordersBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const welcomeUser =
document.getElementById("welcomeUser");

// ==========================================
// MY ORDERS
// ==========================================

ordersBtn.addEventListener("click", () => {


window.location.href =
    "/pages/orders.html";


});

// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", () => {


localStorage.removeItem("token");
localStorage.removeItem("user");

window.location.href = "/";


});

// ==========================================
// DISPLAY USER
// ==========================================

function displayUser() {


const userData =
    localStorage.getItem("user");

if (!userData) {

    welcomeUser.textContent =
        "Welcome";

    return;

}


try {

    const user =
        JSON.parse(userData);

    welcomeUser.textContent =
        `Welcome, ${
            user.name ||
            user.username ||
            user.email ||
            "User"
        }`;

} catch (error) {

    welcomeUser.textContent =
        "Welcome";

}


}

// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {


try {

    productContainer.innerHTML = `
        <div class="empty-state">

            <h2>
                Loading products...
            </h2>

        </div>
    `;


    const response =
        await fetch(
            PRODUCT_API,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


    const data =
        await response.json();


    console.log(
        "Products API response:",
        data
    );


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        localStorage.removeItem("token");

        alert(
            "Your session has expired. Please login again."
        );

        window.location.href = "/";

        return;

    }


    if (
        !response.ok ||
        !data.success
    ) {

        throw new Error(
            data.message ||
            "Failed to load products"
        );

    }


    displayProducts(
        data.products || []
    );


} catch (error) {

    console.error(
        "Load products error:",
        error
    );


    productContainer.innerHTML = `
        <div class="empty-state">

            <h2>
                Unable to load products
            </h2>

            <p>
                ${escapeHtml(error.message)}
            </p>

            <button
                class="btn-primary"
                onclick="loadProducts()">

                Retry

            </button>

        </div>
    `;

}


}

// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {


productContainer.innerHTML = "";


if (products.length === 0) {

    productContainer.innerHTML = `
        <div class="empty-state">

            <h2>
                No Products Found
            </h2>

            <p>
                No products are currently available.
            </p>

        </div>
    `;

    return;

}


products.forEach(product => {

    const card =
        document.createElement("div");

    card.className =
        "product-card";


    const image =
        product.image_url ||
        "https://via.placeholder.com/400x200?text=No+Image";


    const price =
        Number(product.price);


    const stock =
        Number(product.stock);


    const outOfStock =
        stock <= 0;


    card.innerHTML = `

        <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(product.name)}"
            class="product-image"
            onerror="
                this.src='https://via.placeholder.com/400x200?text=No+Image'
            "
        >


        <div class="product-content">


            <span class="product-category">

                ${escapeHtml(
                    product.category ||
                    "General"
                )}

            </span>


            <h3>

                ${escapeHtml(
                    product.name
                )}

            </h3>


            <p class="product-description">

                ${escapeHtml(
                    product.description ||
                    "No description available"
                )}

            </p>


            <div class="product-price">

                ₹${price.toLocaleString(
                    "en-IN",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}

            </div>


            <div
                class="product-stock
                ${outOfStock ? "out-of-stock" : ""}">

                ${
                    outOfStock
                        ? "Out of stock"
                        : `Stock: ${stock}`
                }

            </div>


            ${
                outOfStock
                    ? `
                        <button
                            class="btn-buy"
                            disabled>

                            Out of Stock

                        </button>
                    `
                    : `
                        <div class="quantity-section">

                            <label>
                                Quantity
                            </label>


                            <div class="quantity-control">

                                <button
                                    type="button"
                                    class="quantity-btn decrease">

                                    −

                                </button>


                                <input
                                    type="number"
                                    class="quantity-input"
                                    value="1"
                                    min="1"
                                    max="${stock}"
                                >


                                <button
                                    type="button"
                                    class="quantity-btn increase">

                                    +

                                </button>

                            </div>

                        </div>


                        <div class="order-total">

                            <span>
                                Total
                            </span>

                            <strong class="card-total">

                                ₹${price.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </strong>

                        </div>


                        <button
                            type="button"
                            class="btn-buy">

                            Buy Now

                        </button>
                    `
            }

        </div>

    `;


    productContainer.appendChild(card);


    if (!outOfStock) {

        setupProductCard(
            card,
            product,
            price,
            stock
        );

    }

});


}

// ==========================================
// PRODUCT CARD
// ==========================================

function setupProductCard(
card,
product,
price,
stock
) {


const quantityInput =
    card.querySelector(
        ".quantity-input"
    );


const decreaseBtn =
    card.querySelector(
        ".decrease"
    );


const increaseBtn =
    card.querySelector(
        ".increase"
    );


const buyBtn =
    card.querySelector(
        ".btn-buy"
    );


const totalElement =
    card.querySelector(
        ".card-total"
    );


function updateTotal() {

    let quantity =
        Number(quantityInput.value);


    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    if (quantity > stock) {

        quantity = stock;

    }


    quantityInput.value =
        quantity;


    const total =
        price * quantity;


    totalElement.textContent =
        `₹${total.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

}


decreaseBtn.addEventListener(
    "click",
    () => {

        let quantity =
            Number(quantityInput.value);

        quantity--;

        if (quantity < 1) {

            quantity = 1;

        }

        quantityInput.value =
            quantity;

        updateTotal();

    }
);


increaseBtn.addEventListener(
    "click",
    () => {

        let quantity =
            Number(quantityInput.value);

        quantity++;


        if (quantity > stock) {

            quantity = stock;

        }


        quantityInput.value =
            quantity;

        updateTotal();

    }
);


quantityInput.addEventListener(
    "input",
    updateTotal
);


buyBtn.addEventListener(
    "click",
    () => {

        createOrder(
            product,
            quantityInput,
            buyBtn
        );

    }
);


}

// ==========================================
// CREATE ORDER
// ==========================================

async function createOrder(
product,
quantityInput,
buyBtn
) {


const quantity =
    Number(quantityInput.value);


if (
    !Number.isInteger(quantity) ||
    quantity <= 0
) {

    alert(
        "Please enter a valid quantity."
    );

    return;

}


if (
    quantity > Number(product.stock)
) {

    alert(
        `Only ${product.stock} item(s) are available.`
    );

    return;

}


const confirmed =
    confirm(
        `Place order for ${quantity} × ${product.name}?`
    );


if (!confirmed) {

    return;

}


try {

    buyBtn.disabled = true;

    buyBtn.textContent =
        "Placing Order...";


    const response =
        await fetch(
            ORDER_API,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify({

                    product_id:
                        product.id,

                    quantity:
                        quantity

                })

            }
        );


    const data =
        await response.json();


    console.log(
        "Create order response:",
        data
    );


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        localStorage.removeItem("token");

        alert(
            "Your session has expired. Please login again."
        );

        window.location.href = "/";

        return;

    }


    if (
        !response.ok ||
        !data.success
    ) {

        throw new Error(
            data.message ||
            "Failed to create order."
        );

    }


    alert(
        "Order created successfully!"
    );


    window.location.href =
        "/pages/orders.html";


} catch (error) {

    console.error(
        "Create order error:",
        error
    );


    alert(
        error.message ||
        "Unable to create order."
    );


    buyBtn.disabled = false;

    buyBtn.textContent =
        "Buy Now";

}


}

// ==========================================
// HTML ESCAPING
// ==========================================

function escapeHtml(value) {


const div =
    document.createElement("div");

div.textContent =
    value ?? "";

return div.innerHTML;


}

// ==========================================
// START
// ==========================================

displayUser();

loadProducts();
