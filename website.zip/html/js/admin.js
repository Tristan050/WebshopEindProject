/* eslint-disable no-alert */
function getProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem("tennisProducts");
    return storedProducts ? JSON.parse(storedProducts) : [];
}

// Initialiseert de array met producten uit de lokale opslag.
const tennisItems = getProductsFromLocalStorage();

/**
 * Slaat de producten op in de lokale opslag.
 * @param {Array} products - De array met producten die opgeslagen moet worden.
 */
function saveProductsToLocalStorage(products) {
    localStorage.setItem("tennisProducts", JSON.stringify(products));
}

// Slaat de huidige producten op in de lokale opslag.
saveProductsToLocalStorage(tennisItems);

// Selecteert de zijbalk en de knop om de zijbalk te tonen/verbergen.
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");

// Voegt een click event listener toe aan de zijbalk knop.
sidebarBtn.onclick = function () {
    // Toggle de 'active' klasse om de zijbalk te tonen/verbergen.
    sidebar.classList.toggle("active");

    // Verandert het icoon van de zijbalk knop op basis van de zijbalk status.
    if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
};

// Selecteert het element voor het totale aantal bestellingen.
const totalOrderCountElement = document.getElementById("total-order-count");

// Haalt het huidige totale aantal bestellingen op uit de lokale opslag.
const currentTotalOrder = parseInt(localStorage.getItem("totalOrderCount"), 10) || 0;

// Toont het huidige totale aantal bestellingen op de pagina.
totalOrderCountElement.textContent = currentTotalOrder;

// Selecteert het formulier voor het toevoegen van een nieuw product.
const productForm = document.getElementById("product-form");

// Voegt een submit event listener toe aan het product formulier.
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Haalt de ingevoerde waarden uit de formulierelementen.
    const productName = document.getElementById("product-name").value;
    const productPrice = parseFloat(document.getElementById("product-price").value);
    const productImage = document.getElementById("product-image").value;

    // Controleert of alle velden geldige informatie bevatten.
    if (!productName || Number.isNaN(productPrice) || !productImage) {
        alert("Vul alle velden in met geldige informatie.");
        return;
    }

    // Creëert een nieuw product object.
    const newProduct = {
        amount: 0,
        id: Date.now().toString(),
        name: productName,
        price: productPrice,
        image: productImage,
    };

    // Voegt het nieuwe product toe aan de lijst van producten.
    tennisItems.push(newProduct);

    // Creëert HTML-elementen voor het nieuwe product.
    const productDiv = document.createElement("div");
    productDiv.id = "product-" + newProduct.id;
    productDiv.classList.add("product");

    // Creëert HTML-elementen voor de productinformatie.
    const productImageElement = document.createElement("img");
    productImageElement.src = newProduct.image;
    productImageElement.alt = newProduct.name;

    const productNameElement = document.createElement("h2");
    productNameElement.textContent = newProduct.name;

    const productPriceElement = document.createElement("p");
    productPriceElement.textContent = "Prijs: €" + newProduct.price.toFixed(2);

    const deliveryInfoElement = document.createElement("p");
    deliveryInfoElement.textContent = "Voor 23:59 besteld, morgen in huis";
    deliveryInfoElement.style.color = "black";

    const addToCartButtonElement = document.createElement("button");
    addToCartButtonElement.textContent = "Voeg toe aan winkelwagen";

    // Voegt de HTML-elementen toe aan het productdiv.
    productDiv.appendChild(productImageElement);
    productDiv.appendChild(productNameElement);
    productDiv.appendChild(productPriceElement);
    productDiv.appendChild(deliveryInfoElement);
    productDiv.appendChild(addToCartButtonElement);

    // Slaat de bijgewerkte lijst van producten op in de lokale opslag.
    saveProductsToLocalStorage(tennisItems);

    // Reset het product formulier.
    productForm.reset();
});

// Selecteert het formulier voor het bewerken van een product.
const editProductForm = document.getElementById("edit-product-form");

// Voegt een submit event listener toe aan het bewerkingsformulier.
editProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Haalt de ingevoerde waarden uit de formulierelementen.
    const productId = document.getElementById("product-id").value;
    const newProductName = document.getElementById("new-product-name").value;
    const newProductPrice = parseFloat(document.getElementById("new-product-price").value);
    const newProductImage = document.getElementById("new-product-image").value;

    // Product-ID is verplicht, controleer of het is ingevoerd
    if (!productId.trim()) {
        alert("Product-ID is verplicht.");
        return;
    }

    // Zoek het product in de lijst op basis van het ID.
    const productToUpdate = tennisItems.find((product) => product.id === productId);

    // Controleert of het product is gevonden.
    if (!productToUpdate) {
        alert("Product niet gevonden. Controleer het product-ID.");
        return;
    }

    // Update de productinformatie.
    productToUpdate.name = newProductName;

    // Controleert of de nieuwe prijs is ingevoerd.
    if (!Number.isNaN(newProductPrice)) {
        productToUpdate.price = newProductPrice;
    }

    // Controleert of de nieuwe afbeeldings-URL is ingevoerd.
    if (newProductImage.trim() !== "") {
        productToUpdate.image = newProductImage;
    }

    // Slaat de bijgewerkte lijst van producten op in de lokale opslag.
    saveProductsToLocalStorage(tennisItems);

    // Reset het bewerkingsformulier.
    editProductForm.reset();
});



/**
 * Verwijdert een product op basis van het ingevoerde product-ID.
 */
const removeProductButton = document.getElementById("remove-product-button");

removeProductButton.addEventListener("click", () => {
    // Vraagt de gebruiker om het product-ID in te voeren.
    const productIdToRemove = prompt("Voer het ID in van het product dat je wilt verwijderen:");

    // Controleert of er een geldig product-ID is ingevoerd.
    if (!productIdToRemove) {
        alert("Geen geldig product-ID opgegeven.");
        return;
    }

    // Zoekt het product in de lijst op basis van het ID.
    const productIndex = tennisItems.findIndex((product) => product.id === productIdToRemove);

    // Controleert of het product is gevonden.
    if (productIndex !== -1) {
        // Verwijdert het product uit de lijst.
        tennisItems.splice(productIndex, 1);

        // Zoekt het HTML-element van het product en verwijdert het.
        const productDiv = document.getElementById("product-" + productIdToRemove);
        if (productDiv) {
            productDiv.remove();
        } else {
            alert("Product verwijderd uit de webshop.");
        }

        // Slaat de bijgewerkte lijst van producten op in de lokale opslag.
        saveProductsToLocalStorage(tennisItems);
    } else {
        alert("Product niet gevonden in de webshop. Controleer het product-ID.");
    }
});

/**
 * Haalt de recente verkopen op uit de lokale opslag en toont deze op de pagina.
 */
function getRecentSalesFromLocalStorage() {
    const recentSalesList = document.getElementById("recent-sales-list");

    const recentSales = JSON.parse(localStorage.getItem("recentSales")) || [];

    // Toont elke recente verkoop in een lijst op de pagina.
    recentSales.forEach((sale) => {
        const listItem = document.createElement("li");
        listItem.textContent = `ID: ${sale.id}, Tijd: ${sale.time}`;
        recentSalesList.appendChild(listItem);
    });
}

// Roept de functie aan om recente verkopen weer te geven.
getRecentSalesFromLocalStorage();

/**
 * Toont de producten in het Huidige Producten Overzicht op de admin panel.
 */
function displayProducts1() {
    const productList = document.getElementById("recent-sales-listt");
    productList.innerHTML = "";

    const storedProducts = localStorage.getItem("tennisProducts");

    // Controleert of er opgeslagen producten zijn en toont ze op de pagina.
    if (storedProducts) {
        const products = JSON.parse(storedProducts);

        products.forEach((product) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Product ID: ${product.id} - Naam: ${product.name} - Prijs: $${product.price}`;
            productList.appendChild(listItem);
        });
    }
}

// Laadt de producten bij het laden van de pagina.
window.addEventListener("load", displayProducts1);

/**
 * Reset de producten naar de oorspronkelijke gegevens uit het JSON-bestand.
 */
function resetProducts() {
    // Haalt de producten op uit het JSON-bestand.
    fetch('tennis.json')
        .then(response => response.json())
        .then(data => {
            // Slaat de nieuwe producten op in de lokale opslag.
            localStorage.setItem('tennisProducts', JSON.stringify(data));

            // Toont de bijgewerkte producten op de pagina.
            displayProducts1();
        })
        .catch(error => {
            console.error('Er is een fout opgetreden bij het ophalen van de JSON-gegevens:', error);
        });
}

// Selecteert de resetknop en voegt een click event listener toe.
const resetButton = document.getElementById("reset-products-button");
resetButton.addEventListener("click", resetProducts);

// Voegt een bevestigingsalert toe voordat de reset wordt uitgevoerd.
document.getElementById("reset-products-button").addEventListener("click", function () {
    alert("De producten zijn gereset.");
    resetProducts();
});


