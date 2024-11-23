
// Tornar os campos editáveis ao clicar no botão "EDITAR SEUS DADOS"
document.querySelector('.edit-profile').addEventListener('click', function() {
    document.getElementById('profile-name').disabled = false;
    document.getElementById('profile-dob').disabled = false;
    document.getElementById('profile-insurance').disabled = false;
});

// Adicionando eventos para os botões
document.querySelector('.profile-menu button:nth-child(1)').addEventListener('click', function() {
    window.location.href = '/comecar';  // Redireciona para a página de exames
});
document.querySelector('.profile-menu button:nth-child(2)').addEventListener('click', function() {
    window.location.href = '/exercicio';  // Redireciona para a página de exercícios
});

document.querySelector('.profile-menu button:nth-child(3)').addEventListener('click', function() {
    window.location.href = '/contato';  // Redireciona para a página de contato
});

// Botão de Voltar ao Início
document.querySelector('.profile-footer .back-button').addEventListener('click', function() {
    window.location.href = '/';  // Redireciona para a página inicial
});

// Botão de Logout
document.querySelector('.profile-footer .logout-button').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout bem-sucedido') {  // Verificando a mensagem de sucesso
            window.location.href = '/login';  // Redireciona para a página de login
        } else {
            alert('Erro ao sair');
        }
    })
    .catch(error => {
        console.error('Erro ao realizar o logout:', error);
        alert('Erro no servidor');
    });
});

