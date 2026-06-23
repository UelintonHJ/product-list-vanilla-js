import { getProducts } from './services/api.js';
import { ProductCard } from './components/ProductCard.js';
import { clearElement, createError } from './utils/dom.js';
import { SkeletonCard } from './components/SkeletonCard.js';
import { Pagination } from './components/Pagination.js';
import { getQueryParams ,buildQueryParams } from './utils/url.js';

const container = document.querySelector('#products');
const searchInput = document.querySelector('#search');
const categoryFilter = document.querySelector('#categoryFilter');
const paginationContainer = document.querySelector('#pagination');
const subtleLoading = document.createElement('div');
subtleLoading.className = 'subtle-loading';
subtleLoading.textContent = 'Buscando...';
const sortSelect = document.querySelector('#sort');

let products = [];
let filteredProducts = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;
const DEBOUNCE_DELAY = 300;
let isLoaded = false;

function updateURL() {
    const queryString = buildQueryParams({
        search: searchInput.value.trim(),
        category: categoryFilter.value,
        page: currentPage,
        sort: sortSelect.value
    });

    const newURL = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

    window.history.pushState({}, '', newURL);
}

function renderSkeletons(quantity = ITEMS_PER_PAGE) {
    clearElement(container);

    for (let i = 0; i < quantity; i++) {
        container.appendChild(SkeletonCard());
    }
}

function debounce(callback, delay) {
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

function showSubtleLoading() {
    if (!subtleLoading.isConnected) {
        container.before(subtleLoading);
    }
}

function hideSubtleLoading() {
    if (subtleLoading.isConnected) {
        subtleLoading.remove();
    }
}

function applyFilters({ updateHistory = true, resetPage = true } = {}) {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredProducts = products.filter(product => {
        const matchesSearch =
            product.title.toLowerCase().includes(searchValue);

            const matchesCategory =
            selectedCategory === '' || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
    });

    filteredProducts = sortProducts(filteredProducts);

    if (resetPage) currentPage = 1;

    if (updateHistory) {
        updateURL();
    }

    renderProducts();
}

function sortProducts(list) {
    const sortValue = sortSelect.value;

    switch (sortValue) {
        case 'price-asc':
            return [...list].sort((a, b) => a.price - b.price);

        case 'price-desc':
            return [...list].sort((a, b) => b.price - a.price);

        case 'rating-desc':
            return [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));

        default:
            return list;
    }
}

function getPaginatedProducts() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredProducts.slice(start, end);
}

function normalizeProduct(product) {
    return {
        title: product.title,
        price: product.price,
        image: product.image,
        rating: product.rating ?? { rate: 0, count: 0 },
        description: product.description ?? '',
        category: product.category
    };
}

function renderProducts() {
    if (!isLoaded) return;
    hideSubtleLoading();
    clearElement(container);

    const paginatedProducts = getPaginatedProducts();

    if (paginatedProducts.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Nenhum produto encontrado.';
        empty.classList.add('empty');
        container.appendChild(empty);
    } else {
        paginatedProducts.forEach(product => {
            const card = ProductCard(normalizeProduct(product));
            container.appendChild(card);
        });
    }

    Pagination({
        container: paginationContainer,
        currentPage,
        totalItems: filteredProducts.length,
        itemsPerPage:ITEMS_PER_PAGE,
        onPageChange: (page) => {
            currentPage = page;
            updateURL();
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

        const { search, category, page, sort } = getQueryParams();

        searchInput.value = search;
        categoryFilter.value = category;
        currentPage = page;
        sortSelect.value = sort;

        isLoaded = true;
        applyFilters({ updateHistory: false });
    } catch (error) {
        clearElement(container);
        container.appendChild(
            createError('Erro ao carregar os dados. Tente novamente.')
        );
    }
}

const debouncedSearch = debounce(() => {
    if (!isLoaded) return;
    applyFilters();
}, DEBOUNCE_DELAY);

searchInput.addEventListener('input', () => {
    if (!isLoaded) return;
    debouncedSearch();
});

categoryFilter.addEventListener('change', () => {
    if (!isLoaded) return;
    applyFilters();
});

window.addEventListener('popstate', () => {
    const { search, category, page, sort } = getQueryParams();

    searchInput.value = search;
    categoryFilter.value = category;
    currentPage = page;
    sortSelect.value = sort;

    applyFilters({ updateHistory: false });
});

sortSelect.addEventListener('change', () => {
        if (!isLoaded) return;

        applyFilters();
    })

loadProducts();