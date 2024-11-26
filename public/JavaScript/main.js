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

    // Garantir que o filtro de cor seja aplicado conforme o tipo de usuário
    const userIcon = document.getElementById('user');
    if (userIcon) {
        if (userIcon.classList.contains('admin')) {
            // Efeito vermelho para administradores
            userIcon.style.filter = 'brightness(0) saturate(100%) invert(11%) sepia(76%) saturate(5960%) hue-rotate(358deg) brightness(89%) contrast(114%)';
        } else if (userIcon.classList.contains('normal')) {
            // Efeito azul para usuários normais
            userIcon.style.filter = 'brightness(0) saturate(100%) invert(31%) sepia(88%) saturate(4331%) hue-rotate(187deg) brightness(92%) contrast(101%)';
        }
    }
});
