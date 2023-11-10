const form = document.getElementById('loginForm');
const modal = document.getElementById('myModal');
const modalMessage = document.getElementById('modal-message');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            
            // Si la sesión se inició correctamente

            modalMessage.textContent = 'Sesión iniciada correctamente';
            modal.style.display = 'block';
            window.location.replace('/profile');
        } else {
            modalMessage.textContent = 'Faltan datos o ha ocurrido un error';
            modal.style.display = 'block';
        }
    })
})

const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});