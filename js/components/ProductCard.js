export function ProductCard({title, price, image}) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
    <img src="${image}" alt="${title}">
    <h3>${title}</h3>
    <p>R$ ${price}</p>
    `;

    return card;
}