const exercicios = [
    {
        titulo: 'Alongamento da Coluna Torácica',
        descricao: [
            'Como fazer: Sente-se com as costas retas e os pés apoiados no chão.',
            'Entrelace os dedos e levante os braços acima da cabeça, alongando bem a coluna.',
            'Incline-se levemente para a direita, mantendo a posição por 15-20 segundos, e depois para a esquerda.'
        ]
    },
    {
        titulo: 'Torção da Coluna',
        descricao: [
            'Como fazer: Sente-se com as costas retas e os pés no chão.',
            'Coloque a mão direita no apoio do braço esquerdo ou na parte de trás da cadeira.',
            'Gire suavemente o tronco para a esquerda, olhando para trás, e mantenha a posição por 15-30 segundos.',
            'Repita do outro lado.'
        ]
    },
    {
        titulo: 'Alongamento do Pescoço',
        descricao: [
            'Como fazer: Sente-se com a coluna ereta.',
            'Incline a cabeça para a direita, aproximando a orelha do ombro.',
            'Use a mão direita para aplicar um leve peso na cabeça, aumentando o alongamento.',
            'Mantenha por 15-20 segundos e depois repita do outro lado.',
        ]
    }
    // Adicione mais exercícios conforme necessário
];

let indiceAtual = 0; // Começa no primeiro exercício

// Função para renderizar o exercício atual ou a tela de fim
function renderizarExercicio() {
    const proxExerc = document.getElementById('exercicio-form');
    const containerAlign = document.querySelector('.container-align');
    
    if (indiceAtual < exercicios.length) {
        const exercicio = exercicios[indiceAtual];
        // Atualiza o conteúdo da div com o exercício atual
        proxExerc.innerHTML = `
            <h1>${exercicio.titulo}</h1>
            <p>${exercicio.descricao.join('</p><p>')}</p>
        `;
    } else {
        // Exibe a mensagem de fim de exercícios na div "container-align"
        containerAlign.innerHTML = `
            <div class="fim-exercicio">
                <h1>SEUS EXERCÍCIOS DE HOJE CHEGARAM AO FIM!</h1>
                <img src="/images/fim-exercicios.png" alt="Fim dos Exercícios" style="width: 200px; margin-top: 20px;">
                <p><a href="#">VOLTAR A PÁGINA INICIAL</a>
            </div>
        `;
        // Desativa os botões ao chegar ao fim
        document.getElementById('feito').style.display = 'none';
        document.getElementById('naoFeito').style.display = 'none';
    }
}

// Avançar para o próximo exercício (ícone "feito")
document.getElementById('feito').addEventListener('click', function() {
    if (indiceAtual < exercicios.length) {
        indiceAtual++; // Avança para o próximo exercício
        renderizarExercicio();
    }
});

// Voltar para o exercício anterior (ícone "naoFeito")
document.getElementById('naoFeito').addEventListener('click', function() {
    if (indiceAtual > 0) {
        indiceAtual--; // Volta para o exercício anterior
        renderizarExercicio();
    }
});

// Inicializa com o primeiro exercício
renderizarExercicio();