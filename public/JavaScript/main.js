document.addEventListener('DOMContentLoaded', function() {
    // Evento de clique no logo
    document.getElementById('logo').addEventListener('click', voltar);

    function voltar() {
        window.location.href = '/';
    }

    // Evento de clique na foto do usuário
    document.getElementById('user').addEventListener('click', checkLogin);

    function checkLogin() {
        // Faz uma requisição para verificar se o usuário está logado
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // Se estiver logado, redireciona para settings
                    window.location.href = '/settings';
                } else {
                    // Se não estiver logado, redireciona para login
                    window.location.href = '/login';
                }
            })
            .catch(error => console.error('Erro ao verificar login:', error));
    }
});
