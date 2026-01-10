export function Pagination({
    container,
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    maxVisiblePages = 4
}) {
    container.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    if (currentPage < 1) {
        currentPage = 1;
    }

    if (totalPages <= 1) return;

    const createButton = (label, disabled, onClick) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.disabled = disabled;
        button.addEventListener('click', onClick);
        return button;
    };

    container.appendChild(
        createButton('Anterior', currentPage === 1, () => {
            if (currentPage > 1) {
                onPageChange(currentPage - 1);
            }
        })
    );

    let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
    );

    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.classList.add('page-number');

        if (page === currentPage) {
            pageButton.classList.add('active');
            pageButton.disabled = true;
        }

        pageButton.addEventListener('click', () => {
            if (page >= 1 && page <= totalPages) {
                onPageChange(page);
            }            
        });

        container.appendChild(pageButton);
    }

    container.appendChild(
        createButton('Próximo', currentPage === totalPages, () => {
            if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
            }
        })
    );
}