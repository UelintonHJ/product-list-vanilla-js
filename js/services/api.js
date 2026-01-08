const BASE_URL = 'https://fakestoreapi.com';

export async function getProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`);

        if (!response.ok) {
            throw new Error('Resposta inválida da API');
        }

        return await response.json();
    } catch (error) {
        console.error('[API ERROR]', error);
        throw error;
    }
}