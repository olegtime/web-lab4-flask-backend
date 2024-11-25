document.getElementById('shoot-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    let isValid = true;
    let errorMessage = '';

    const regex = /^-?\d*\.?\d*$/;
    if (!regex.test(data.y)) {
        isValid = false;
        errorMessage += 'Y должен быть числом.\nНецелые значения Y вводятся через одну точку.\n';
    }

    data.x = parseFloat(data.x);
    data.y = parseFloat(data.y);
    data.r = parseInt(data.r, 10);

    if (isNaN(data.x)) {
        isValid = false;
        errorMessage += 'X должен быть выбран.\n';
    }

    if (isNaN(data.y) || data.y < -8 || data.y > 8) {
        isValid = false;
        errorMessage += 'Y должен быть числом в диапазоне от -8 до 8.\n';
    }

    if (!isValid) {
        alert(`Ошибка ввода данных:\n${errorMessage}`);
        return;
    }

    shoot(data);
});
