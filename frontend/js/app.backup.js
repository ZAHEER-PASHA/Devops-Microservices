const PRODUCT_API = "http://localhost:5002/api/products";

const productContainer = document.getElementById("productContainer");
const productForm = document.getElementById("productForm");

const productModal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");

const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const message = document.getElementById("message");

// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {
    try {
        productContainer.innerHTML = "<p>Loading products...</p>";

        const response = await fetch(PRODUCT_API);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        displayProducts(data.products || []);

    } catch (error) {
        console.error(error);

        productContainer.innerHTML = `
            <div class="empty-state">
                <h2>Unable to load products</h2>
                <p>Make sure the Product Service is running.</p>
            </div>
        `;
    }
}

// =========================
// DISPLAY PRODUCTS
// =========================

function displayProducts(products) {
    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Products Found</h2>
                <p>Add your first product using the "Add Product" button.</p>
            </div>
        `;

        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");

        card.className = "product-card";

        const image = product.image_url
            ? product.image_url
            : "https://via.placeholder.com/400x200?text=No+Image";

        card.innerHTML = `
            <img
                src="${image}"
                alt="${escapeHtml(product.name)}"
                class="product-image"
                onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'"
            >

            <div class="product-content">

                <span class="product-category">
                    ${escapeHtml(product.category || "General")}
                </span>

                <h3>
                    ${escapeHtml(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHtml(
                        product.description || "No description available"
                    )}
                </p>

                <div class="product-price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </div>

                <div class="product-stock">
                    Stock: ${product.stock}
                </div>

                <div class="product-actions">

                    <button
                        class="btn-edit"
                        onclick="editProduct(${product.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="btn-delete"
                        onclick="deleteProduct(${product.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

        productContainer.appendChild(card);
    });
}

// =========================
// ADD PRODUCT MODAL
// =========================

addProductBtn.addEventListener("click", () => {
    productForm.reset();

    document.getElementById("productId").value = "";

    modalTitle.textContent = "Add Product";

    productModal.classList.remove("hidden");
});

// =========================
// CLOSE MODAL
// =========================

function closeProductModal() {
    productModal.classList.add("hidden");
}

closeModal.addEventListener("click", closeProductModal);

cancelBtn.addEventListener("click", closeProductModal);

// =========================
// CREATE / UPDATE PRODUCT
// =========================

productForm.addEventListener("submit", async event => {
    event.preventDefault();

    const productId =
        document.getElementById("productId").value;

    const productData = {
        name: document.getElementById("productName").value,
        description: document.getElementById("description").value,
        price: Number(document.getElementById("price").value),
        stock: Number(document.getElementById("stock").value),
        category: document.getElementById("category").value,
        image_url: document.getElementById("imageUrl").value
    };

    try {
        let response;

        // UPDATE
        if (productId) {
            response = await fetch(
                `${PRODUCT_API}/${productId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(productData)
                }
            );
        }

        // CREATE
        else {
            response = await fetch(
                PRODUCT_API,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(productData)
                }
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Operation failed"
            );
        }

        closeProductModal();

        showMessage(
            data.message || "Product saved successfully"
        );

        await loadProducts();

    } catch (error) {
        console.error(error);

        showMessage(
            error.message,
            true
        );
    }
});

// =========================
// EDIT PRODUCT
// =========================

async function editProduct(id) {
    try {
        const response =
            await fetch(`${PRODUCT_API}/${id}`);

        if (!response.ok) {
            throw new Error("Failed to load product");
        }

        const data = await response.json();

        const product = data.product;

        document.getElementById("productId").value =
            product.id;

        document.getElementById("productName").value =
            product.name;

        document.getElementById("description").value =
            product.description || "";

        document.getElementById("price").value =
            product.price;

        document.getElementById("stock").value =
            product.stock;

        document.getElementById("category").value =
            product.category || "";

        document.getElementById("imageUrl").value =
            product.image_url || "";

        modalTitle.textContent = "Edit Product";

        productModal.classList.remove("hidden");

    } catch (error) {
        console.error(error);

        showMessage(
            error.message,
            true
        );
    }
}

// =========================
// DELETE PRODUCT
// =========================

async function deleteProduct(id) {
    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );

    if (!confirmed) {
        return;
    }

    try {
        const response =
            await fetch(
                `${PRODUCT_API}/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Delete failed"
            );
        }

        showMessage(
            data.message ||
            "Product deleted successfully"
        );

        await loadProducts();

    } catch (error) {
        console.error(error);

        showMessage(
            error.message,
            true
        );
    }
}

// =========================
// MESSAGE
// =========================

function showMessage(text, isError = false) {
    message.textContent = text;

    message.style.color =
        isError ? "#dc2626" : "#059669";

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}

// =========================
// BASIC HTML ESCAPING
// =========================

function escapeHtml(value) {
    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}

// =========================
// INITIAL LOAD
// =========================

loadProducts();