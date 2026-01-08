export function clearElement(element) {
    element.innerHTML = '';
}

export function createLoading(text = 'Carregando...') {
    const loading = document.createElement('p');
    loading.classList.add('loading');
    loading.textContent = text;
    return loading;
}

export function createError(message) {
    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = message;
    return error;
}