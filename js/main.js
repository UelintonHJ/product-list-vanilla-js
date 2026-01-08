import { getProducts } from './services/api.js';
import { ProductCard } from './components/ProductCard.js';
import { clearElement, createLoading, createError } from './utils/dom.js';

const container = document.querySelector('#products');
const searchInput = document.querySelector('#search');

let products = [];

function renderProducts(list) {
    clearElement(container);

    if (list.length === 0) {
        container.appendChild(
            createError('Nenhum produto encontrado.')
        );
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
        const products = await getProducts();
        renderProducts(products);
    } catch (error) {
        clearElement(container);
        container.appendChild(
            createError('Erro ao carregar os dados. Tente novamente.')
        );
    }
}

searchInput.addEventListener('input', (event) => {
    const value = event.target.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(value)
    );

    renderProducts(filteredProducts);
});

loadProducts();