document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-box').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Limpa a mensagem de erro antes de tentar fazer o login
        document.getElementById('error-message').innerText = '';

        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        })
        .then(response => response.json()) // Processa a resposta como JSON
        .then(data => {
            if (data.message === 'Login bem-sucedido') {
                // Redireciona para a página inicial
                window.location.href = '/';
            } else {
                // Exibe a mensagem de erro, se o login falhou
                document.getElementById('error-message').innerText = data.message || 'Erro ao realizar o login';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('error-message').innerText = 'Erro ao realizar o login';
        });
    });

    // Limpa a mensagem de erro ao digitar a senha
    document.getElementById('password').addEventListener('input', function() {
        document.getElementById('error-message').innerText = '';
    });
});
