export function ProductCard({ title, price, image, rating, description, category }) {
    const card = document.createElement('article');
    card.classList.add('card');

    const formattedPrice =
        new Intl.NumberFormat(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        ).format(price);

    const safeRating = rating?.rate ?? 0;
    const ratingClass = safeRating >= 4 ? 'rating high' : 'rating';
    const safeCount = rating?.count ?? 0;

    const safeDescription = description ?? '';

    const shortDescription = safeDescription.length > 90
        ? safeDescription.slice(0, 90) + '...'
        : safeDescription;

    card.innerHTML = `
    <div class="card-image">
        <img src="${image}" alt="${title}">
    </div>

    <span class="badge">${category}</span>

    <h3>${title}</h3>

    <p class="${ratingClass}">
        ⭐ ${safeRating.toFixed(1)}
        <span class="reviews">
            (${safeCount} avaliações)
        </span>
    </p>

    <p class="description">
        ${shortDescription}
    </p>
    
    <p class="price">${formattedPrice}</p>
    `;

    return card;
}