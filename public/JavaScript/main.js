document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logo').addEventListener('click', voltar);

    function voltar() {
        window.location.href = '/';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user').addEventListener('click', login)

    function login() {
        window.location.href = '/login';
    }
});
