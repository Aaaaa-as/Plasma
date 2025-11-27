// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}

let themeBtn = document.querySelector("#themeToggle")

function setTheme(theme) {
    if (theme == 'light') {
        document.body.classList.add("light-theme");
        themeBtn.innerHTML = '<i class="bi bi-moon"></i>';
    } else {
        document.body.classList.remove("light-theme");
        themeBtn.innerHTML = '<i class="bi bi-brightness-high"></i>';
    }
}


let theme = getCookieValue('theme')
setTheme(theme)

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle('light-theme'); // Перемикаємо клас теми
    if (theme == 'light') {
        theme = 'dark'
    } else {
        theme = 'light'
    }
    setTheme(theme)
    // Зберігаємо JSON рядок у кукі
    document.cookie = `theme=${theme}; max-age=${60 * 60 * 24 * 7}"`;
    path="/";
}) 

// Очікуємо завантаження сторінки
document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі написи для анімації
    const textElements = document.querySelectorAll('.fade-in-text');

    // Додаємо клас "show" для запуску анімації
    textElements.forEach(element => {
        element.classList.add('show');
    });
});




// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("db.json");
    let products = await response.json();
    return products;
};


// Генеруємо HTML-код для карточки товару
function getInterestListItemHTML(product) {
    // Створюємо JSON-строку з даними про товар і зберігаємо її в data-атрибуті
    let productData = products.games[product]

    return `
        <div class="game-list-item">
                <div class="game-list-content">
                    <img src="${productData.image}" class="align-text-bottom game-logo" alt="${productData.name} Logo">
                    <span class="game-name">${productData.name}</span>
                </div>
                <div class="game-list-content">
                    <span class="tags">${productData.tags.join(',')}</span>
                    <span class="${productData.cost == "FREE" ? "free" : "paid"}-cost">${productData.cost == "FREE" ? "FREE" : productData.cost+" $"}</span>
                </div>
                <div class="add-to-cart" product=${product}><i class="bi bi-plus" product=${product}></i></div>
            </div>
    `
    
    // `
    //     <div class="product-card">
    //             <img src="${product.image}" height="200px" >
    //             <div class="product-details">
    //                 <p class="product-title">${product.title}</p>
    //                 <p class="product-descr">${product.descr}</p>
    //                 <div class="product-actions">
    //                     <p class="product-price"> ${product.price}₴</p>
    //                     <button type="button" class="add-to-cart" data-product='${productData}'>Add to Cart
    //                     </button>
    //                     <i class="far fa-heart" id="like-button1"></i>
    //                 </div>
    //             </div>
    //         </div>
    // `;
}


// Відображаємо товари на сторінці
getProducts().then(function (p) {


    products = p;

    let interest_list = document.querySelector('.interest-list');
    for (let v in p.games) {
        interest_list.innerHTML += getInterestListItemHTML(v);   
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.interest-list .add-to-cart');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})




class ShoppingCart {
    constructor() {
        this.items = new Set();
       // this.cartCounter = document.querySelector('.cart-counter');
        // отримуємо лічильник кількості товарів у кошику
        this.cartElement = document.querySelector('#cart-items');
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }


    // Додавання товару до кошика
    addItem(item) {
        if (!this.items.has(item)) {
            this.items.add(item); // Якщо товар вже є, збільшуємо його кількість на одиницю
        }
        this.saveCartToCookies();
    }


    


    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(Array.from(this.items));
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }


    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = new Set(JSON.parse(cartCookie));
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let v of this.items) { // проходимося по всіх ключах об'єкта this.items
            total += products[v].cost == "FREE" ? 0 : products[v].cost; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

let products;



let cart = new ShoppingCart();

// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('product');
    const product =+productData;


    // Додаємо товар до кошика
    cart.addItem(product);
    console.log(cart);
}


let interest_list = document.querySelector('.interest-list');

