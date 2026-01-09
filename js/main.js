import { getProducts } from './services/api.js';
import { ProductCard } from './components/ProductCard.js';
import { clearElement, createLoading, createError } from './utils/dom.js';

const container = document.querySelector('#products');
const searchInput = document.querySelector('#search');
const prevButton = document.querySelector('#prevPage');
const nextButton = document.querySelector('#nextPage');
const pageInfo = document.querySelector('#pageInfo');

let products = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 6;
let isLoaded = false;

function getPaginatedProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return filteredProducts.slice(start, end);
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    pageInfo.textContent = totalPages
    ? `Página ${currentPage} de ${totalPages}`
    : '';

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
}

function renderProducts(list) {
    clearElement(container);

    const paginatedProducts = getPaginatedProducts();

    if (paginatedProducts.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Nenhum produto encontrado.';
        empty.classList.add('empty');
        container.appendChild(empty);
        updatePagination();
        return;
    }

    paginatedProducts.forEach(products => {
        const card = ProductCard(products);
        container.appendChild(card);
    });

    updatePagination();
}

async function loadProducts() {
    clearElement(container);
    container.appendChild(createLoading());

    try {
        products = await getProducts();
        filteredProducts = products;
        currentPage = 1;
        isLoaded = true;
        renderProducts();
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

    filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(value)
    );

    currentPage = 1;
    renderProducts();
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
    }
});

loadProducts();