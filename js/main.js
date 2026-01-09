import { getProducts } from './services/api.js';
import { ProductCard } from './components/ProductCard.js';
import { clearElement, createLoading, createError } from './utils/dom.js';
import { SkeletonCard } from './components/SkeletonCard.js';
import { Pagination } from './components/Pagination.js';

const container = document.querySelector('#products');
const searchInput = document.querySelector('#search');
const categoryFilter = document.querySelector('#categoryFilter');
const paginationContainer = document.querySelector('#pagination');

let products = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 6;
let isLoaded = false;

function renderSkeletons(quantity = itemsPerPage) {
    clearElement(container);

    for (let i = 0; i < quantity; i++) {
        container.appendChild(SkeletonCard());
    }
}

function debounce(callback, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }
}

function loadCategories(products) {
    const categories = [...new Set(products.map(product => product.category))];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function applyFilters() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredProducts = products.filter(product => {
        const matchesSearch =
            product.title.toLowerCase().includes(searchValue);

            const matchesCategory =
            selectedCategory === '' || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    renderProducts();
}

function getPaginatedProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return filteredProducts.slice(start, end);
}

function renderProducts() {
    clearElement(container);

    const paginatedProducts = getPaginatedProducts();

    if (paginatedProducts.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Nenhum produto encontrado.';
        empty.classList.add('empty');
        container.appendChild(empty);
    } else {
        paginatedProducts.forEach(product => {
            const card = ProductCard(product);
            container.appendChild(card);
        });
    }

    Pagination({
        container: paginationContainer,
        currentPage,
        totalItems: filteredProducts.length,
        itemsPerPage,
        onPageChange: (page) => {
            currentPage = page;
            renderProducts();
        }
    });
}

async function loadProducts() {
    renderSkeletons();

    try {
        products = await getProducts();
        filteredProducts = products;
        loadCategories(products)
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

const debouncedSearch = debounce((event) => {
    if (!isLoaded) return;
    applyFilters();
}, 300);

searchInput.addEventListener('input', debouncedSearch);

categoryFilter.addEventListener('change', () => {
    if (!isLoaded) return;
    applyFilters();
});

loadProducts();