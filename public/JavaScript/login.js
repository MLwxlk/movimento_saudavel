document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-box').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    window.location.href = '/'; // Redireciona para a página inicial
                });
            } else {
                return response.json().then(err => {
                    document.getElementById('error-message').innerText = 'Email ou senha incorretos';
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('error-message').innerText = 'Erro ao realizar o login';
        });
    });

    // Limpa a mensagem de erro ao digitar
    document.getElementById('password').addEventListener('input', function() {
        document.getElementById('error-message').innerText = '';
    });
});
