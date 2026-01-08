import { getProducts } from './services/api.js';
import { ProductCard } from './components/ProductCard.js';
import { clearElement, createLoading, createError } from './utils/dom.js';

const container = document.querySelector('#products');
const searchInput = document.querySelector('#search');

let products = [];
let isLoaded = false;

function renderProducts(list) {
    clearElement(container);

    if (list.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Nenhum produto encontrado.';
        empty.classList.add('empty');
        container.appendChild(empty);
        return;
    }

    list.forEach(product => {
        const card = ProductCard(product);
        container.appendChild(card);
    });
}

async function loadProducts() {
    clearElement(container);
    container.appendChild(createLoading());

    try {
        products = await getProducts();
        isLoaded = true;
        renderProducts(products);
    } catch (error) {
        clearElement(container);
        container.appendChild(
            createError('Erro ao carregar os dados. Tente novamente.')
        );
    }
}

searchInput.addEventListener('input', (event) => {
    if (!isLoaded) return;
    
    const value = event.target.value.trim().toLowerCase();

    if (value === '') {
        renderProducts(products);
        return;
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(value)
    );

    renderProducts(filteredProducts);
});

loadProducts();