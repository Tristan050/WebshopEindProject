/**
 * Haalt de opgeslagen producten op uit de lokale opslag of retourneert een lege array als er geen opgeslagen producten zijn.
 */
function getProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem("tennisProducts");
    return storedProducts ? JSON.parse(storedProducts) : [];
}

// Initialiseert de lijst van tennisproducten met de opgeslagen producten.
let tennisItems = getProductsFromLocalStorage();

// Controleert of de lokale opslag voor tennisProducts is ingesteld, zo niet, haalt de gegevens op uit "tennis.json".
if (!tennisItems || tennisItems.length === 0) {
    fetch('tennis.json')
        .then(response => response.json())
        .then(data => {
            const jsonData = JSON.stringify(data);
            localStorage.setItem('tennisProducts', jsonData);
            tennisItems = data;
            // Toont de lijst van tennisproducten op de pagina.
            displayProducts();
        })
        .catch(error => {
            console.error('Er is een fout opgetreden bij het ophalen van de JSON-gegevens:', error);
        });
} else {
    displayProducts();
}

// Selecteert de HTML-elementen voor het winkelwagentje.
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");

// Voegt een event listener toe aan de lijst van winkelwagenitems om te reageren op wijzigingen.
document.getElementById("cart-items").addEventListener("DOMSubtreeModified", function () {
    const cartItems = document.getElementById("cart-items").children.length;
    checkoutButton.disabled = cartItems === 0;
});

// Voegt een click event listener toe aan de afrekenknop.
checkoutButton.addEventListener("click", function () {
    const cartItems = document.getElementById("cart-items").children.length;

    // Controleert of er producten in de winkelwagen zitten.
    if (cartItems > 0) {
        // Toont een bedankbericht en voert de afrekenanimatie uit.
        alert("Bedankt voor uw bestelling!");
        cartItemsElement.classList.add("checkout-animation");

        // Voegt de laatste toegevoegde product aan de recente verkopen toe.
        const lastProductInCart = cart[cart.length - 1];
        addRecentSale(lastProductInCart);

        // Reset de winkelwagen en update de weergave.
        cart.length = 0;
        updateCart();

        // Voert de afrekenanimatie uit en reset de winkelwagen na de animatie.
        setTimeout(() => {
            cartItemsElement.classList.remove("checkout-animation");
        }, 0);

        // Telt het aantal bestellingen op en slaat het op in de lokale opslag.
        const currentTotalOrder = parseInt(localStorage.getItem("totalOrderCount"), 10) || 0;
        const newTotalOrder = currentTotalOrder + 1;
        localStorage.setItem("totalOrderCount", newTotalOrder);
    } else {
        // Toont een melding als er geen producten in de winkelwagen zitten.
        alert("Voeg eerst producten toe aan uw winkelwagen.");
    }
});

// Initialiseert een lege winkelwagen.
const cart = [];

/**
 * Update de weergave van de winkelwagen op basis van de huidige inhoud van de winkelwagen.
 */
function updateCart() {
    // Maakt de huidige weergave van de winkelwagen leeg.
    cartItemsElement.innerHTML = "";

    let total = 0;

    // Toont elk product in de winkelwagen en berekent het totaalbedrag.
    cart.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.textContent = product.name + " - €" + product.price.toFixed(2);
        cartItemsElement.appendChild(listItem);
        total += product.price;
    });

    // Toont het totaalbedrag in de winkelwagen.
    cartTotalElement.textContent = "Totaal: €" + total.toFixed(2);
}

/**
 * Toont de lijst van tennisproducten op de pagina.
 */
function displayProducts() {
    let productContainer = document.getElementById("product-list");

    // Voor elk tennisproduct wordt een HTML-element aangemaakt en toegevoegd aan de pagina.
    tennisItems.forEach(function (product) {
        let productDiv = document.createElement("div");
        productDiv.classList.add("product");

        let productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;
        productDiv.appendChild(productImage);

        let productName = document.createElement("h2");
        productName.textContent = product.name;

        let productPrice = document.createElement("p");
        productPrice.textContent = "Prijs: €" + product.price.toFixed(2);

        let deliveryInfo = document.createElement("p");
        deliveryInfo.textContent = "Voor 23:59 besteld, morgen in huis";
        deliveryInfo.style.color = "black";

        let addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Voeg toe aan winkelwagen";

        // Voegt een click event listener toe aan de knop om het product aan de winkelwagen toe te voegen.
        addToCartButton.addEventListener("click", () => {
            addToCart(product);
        });

        // Voegt alle elementen toe aan de productdiv.
        productDiv.appendChild(productName);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(deliveryInfo);
        productDiv.appendChild(addToCartButton);

        // Voegt de productdiv toe aan de pagina.
        productContainer.appendChild(productDiv);
    });
}

/**
 * Slaat de huidige producten op in de lokale opslag.
 */
function saveProductsToLocalStorage(products) {
    localStorage.setItem("tennisProducts", JSON.stringify(products));
}

// Slaat de huidige producten op in de lokale opslag.
saveProductsToLocalStorage(tennisItems);




/**
 * Toont een melding dat het product is toegevoegd aan de winkelwagen en verbergt deze na een bepaalde tijd.
 */
function showAddedToCartMessage() {
    const addedToCartMessage = document.getElementById("added-to-cart-message");
    addedToCartMessage.style.display = "block";
    setTimeout(() => {
        addedToCartMessage.style.display = "none";
    }, 1750);
}

/**
 * Haalt de winkelwagen op uit de lokale opslag of retourneert een lege array als er geen winkelwagen is opgeslagen.
 */
function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem("tennisCart");
    return storedCart ? JSON.parse(storedCart) : [];
}

/**
 * Slaat de bestellingen op in de lokale opslag.
 */
function saveOrdersToLocalStorage(orders) {
    localStorage.setItem("tennisOrders", JSON.stringify(orders));
}

/**
 * Haalt de bestellingen op uit de lokale opslag of retourneert een lege array als er geen bestellingen zijn opgeslagen.
 */
function getOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem("tennisOrders");
    return storedOrders ? JSON.parse(storedOrders) : [];
}

/**
 * Voegt een product toe aan de winkelwagen, update de weergave en toont een melding.
 * @param {Object} product - Het product dat aan de winkelwagen moet worden toegevoegd.
 */
function addToCart(product) {
    cart.push(product);
    updateCart();
    showAddedToCartMessage();
}

// Selecteert HTML-elementen voor het legen van de winkelwagen.
const clearCartButton = document.getElementById("clear-cart-btn");
const clearCartButton1 = document.getElementById("clear-cart-btn");
const clearCartMessage = document.getElementById("clear-cart-message");

/**
 * Leegt de winkelwagen, update de weergave en toont een melding als de gebruiker bevestigt.
 */
function emptyCart() {
    if (window.confirm("Weet u zeker dat u de winkelwagen wilt legen?")) {
        cart.length = 0;
        updateCart();
        clearCartMessage.style.display = "block";

        setTimeout(() => {
            clearCartMessage.style.display = "none";
        }, 3000);
    }
}

// Voegt een click event listener toe aan de knop voor het legen van de winkelwagen.
clearCartButton.addEventListener("click", emptyCart);

// Selecteert HTML-elementen voor het cookiemelding.
const cookiePopup = document.getElementById("cookiePopup");
const acceptCookieBtn = document.getElementById("acceptCookie");
const rejectCookieBtn = document.getElementById("rejectCookie");

/**
 * Stelt een cookie in met de opgegeven naam, waarde en vervaldatum.
 * @param {string} cname - De naam van het cookie.
 * @param {string} cvalue - De waarde van het cookie.
 * @param {number} exdays - Het aantal dagen tot het cookie verloopt.
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Accepteert de cookies, stelt het cookiesAccepted-cookie in en verbergt het cookiemelding.
 */
function acceptCookies() {
    setCookie("cookiesAccepted", "true", 30);
    cookiePopup.style.display = "none";
}

// Voegt een click event listener toe aan de knop voor het accepteren van cookies.
acceptCookieBtn.addEventListener("click", acceptCookies);

// Voegt een click event listener toe aan de knop voor het afwijzen van cookies.
rejectCookieBtn.addEventListener("click", () => {
    cookiePopup.style.display = "none";
});

// Toont het cookiemelding als cookies nog niet zijn geaccepteerd.
if (document.cookie.indexOf("cookiesAccepted=true") === -1) {
    cookiePopup.style.display = "block";
}

// Selecteert HTML-element voor de knop om naar boven te scrollen.
const scrollTopButton = document.getElementById("scroll-top-button");

// Voegt een click event listener toe aan de knop om naar boven te scrollen.
scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

// Voegt een scroll event listener toe aan het venster om de zichtbaarheid van de knop om naar boven te scrollen aan te passen.
window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 300) {
        scrollTopButton.style.display = "block";
    } else {
        scrollTopButton.style.display = "none";
    }
});

// Selecteert HTML-elementen voor de afrekenknop en het betaalmethode-selectievak.
const checkoutButton1 = document.getElementById("checkout-btn");
const paymentMethodSelect = document.getElementById("payment-method");

/**
 * Voert een actie uit wanneer op de afrekenknop wordt geklikt, bijvoorbeeld het geselecteerde betaalmethode ophalen.
 */
checkoutButton.addEventListener("click", () => {
    const selectedPaymentMethod = paymentMethodSelect.value;
});


// Selecteert HTML-elementen voor gebruikersnaam, wachtwoord en de knop voor de admin-login.
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const adminButton = document.getElementById("admin-button");

// Definieert de correcte gebruikersnaam en wachtwoord.
const correctUsername = "tristanzuidhof";
const correctPassword = "hoi123";

/**
 * Valideert de ingevoerde gebruikersnaam en wachtwoord en schakelt de admin-knop in of uit op basis van de validatie.
 */
function validateInputs() {
    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
        adminButton.removeAttribute("disabled");
    } else {
        adminButton.setAttribute("disabled", "true");
    }
}

// Voegt event listeners toe aan de invoervelden voor gebruikersnaam en wachtwoord.
usernameInput.addEventListener("input", validateInputs);
passwordInput.addEventListener("input", validateInputs);

// Voegt een click event listener toe aan de admin-knop.
adminButton.addEventListener("click", () => {
    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
        window.location.href = "admin.html";
    } else {
        console.log("Onjuiste gebruikersnaam of wachtwoord. Probeer opnieuw.");
    }
});

// Selecteert HTML-element voor de lijst met recente verkopen.
const recentSalesList = document.getElementById("recent-sales-list");

/**
 * Toont recente verkopen in de lijst.
 */
function displayRecentSales() {
    recentSalesList.innerHTML = "";
    const recentSales = getRecentSalesFromLocalStorage();

    recentSales.forEach((sale) => {
        const listItem = document.createElement("li");
        listItem.classList.add("sale-item");
        listItem.innerHTML = `
            <span class="sale-date">${sale.timestamp}</span>
            <span class="sale-product">${getProductNameById(sale.id)}</span>
            <span class="sale-price">Afgerekend</span>
        `;
        recentSalesList.appendChild(listItem);
    });
}

/**
 * Haalt recente verkopen op uit de lokale opslag.
 */
function getRecentSalesFromLocalStorage() {
    const storedRecentSales = localStorage.getItem("recentSales");
    return storedRecentSales ? JSON.parse(storedRecentSales) : [];
}

/**
 * Haalt de naam van een product op basis van het product-ID.
 * @param {string} productId - Het ID van het product.
 * @returns {string} - De naam van het product of "Onbekend product" als het product niet wordt gevonden.
 */
function getProductNameById(productId) {
    const product = tennisItems.find((item) => item.id === productId);
    return product ? product.name : "Onbekend product";
}

/**
 * Genereert een uniek bestel-ID.
 * @returns {string} - Het gegenereerde bestel-ID.
 */
function generateOrderID() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Initialiseert de lijst met recente verkopen in de lokale opslag.
 */
function initializeRecentSales() {
    const recentSales = getRecentSalesFromLocalStorage();
    if (!recentSales || recentSales.length === 0) {
        localStorage.setItem("recentSales", JSON.stringify([]));
    }
}

// Initialiseert de lijst met recente verkopen.
initializeRecentSales();

/**
 * Voegt een recente verkoop toe aan de lijst.
 * @param {Object} product - Het product dat recent is verkocht.
 */
function addRecentSale(product) {
    const recentSales = getRecentSalesFromLocalStorage();
    const now = new Date();
    const sale = {
        id: product.id,
        time: now.toLocaleString(),
    };

    recentSales.push(sale);
    localStorage.setItem("recentSales", JSON.stringify(recentSales));
}




