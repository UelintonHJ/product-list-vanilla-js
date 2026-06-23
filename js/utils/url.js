export function getQueryParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        search: params.get('search') || '',
        category: params.get('category') || '',
        page: Number(params.get('page')) || 1,
        sort: params.get('sort') || ''
    };
}

export function buildQueryParams({
    search = '',
    category = '',
    page = 1,
    sort = ''
}) {
    const params = new URLSearchParams();

    if (search) {
        params.set('search', search);
    }

    if (category) {
        params.set('category', category);
    }

    if (page > 1) {
        params.set('page', String(page));
    }

    if (sort) {
        params.set('sort', sort);
    }

    return params.toString();
}