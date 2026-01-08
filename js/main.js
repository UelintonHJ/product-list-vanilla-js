import { getProducts } from './services/api.js';
import { ProductCard } from './components/ProductCard.js';
import { clearElement, createLoading, createError } from './utils/dom.js';

const container = document.querySelector('#products');

async function loadProducts() {
    clearElement(container);

    const loading = createLoading();
    container.appendChild(loading);

    try {
        const products = await getProducts();

        clearElement(container);

        products.forEach(product => {
            const card = ProductCard(product);
            container.appendChild(card);
        });
    } catch (error) {
        clearElement(container);
        container.appendChild(
            createError('Erro ao carregar os dados. Tente novamente.')
        );
    }
}

loadProducts();