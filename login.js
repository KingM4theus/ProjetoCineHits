document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simular login salvando no localStorage
        localStorage.setItem('username', username);
        alert('Login bem-sucedido!');
        window.location.href = 'index.html'; // Redireciona para a página inicial após login
    });
});









