export function ProductCard({ title, price, image }) {
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

    card.innerHTML = `
    <div class="card-image">
        <img src="${image}" alt="${title}">
    </div>

    <h3>${title}</h3>
    
    <p class="price">${formattedPrice}</p>
    `;

    return card;
}