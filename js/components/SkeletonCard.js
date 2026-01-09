export function SkeletonCard() {
    const card = document.createElement('div');
    card.classList.add('card', 'skeleton');

    card.innerHTML = `
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text short"></div>
    `;

    return card;
}