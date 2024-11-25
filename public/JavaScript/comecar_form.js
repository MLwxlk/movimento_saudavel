let currentSlide = 1; // Slide atual do carrossel

// Função para mostrar o slide atual
function displaySlide(slide) {
    const slideGroups = document.querySelectorAll('.carousel-slide');
    const totalSlides = slideGroups.length; // Determinar automaticamente o total de slides

    slideGroups.forEach((group, index) => {
        group.style.display = (index === slide - 1) ? 'block' : 'none';
    });

    updateSlideIndicator(slide);

    // Ativar ou desativar botões de navegação conforme o slide atual
    document.getElementById('prev_slide_btn').disabled = (slide === 1);
    document.getElementById('next_slide_btn').disabled = (slide === totalSlides);

    console.log(`Mostrando slide: ${slide}, Total de slides: ${totalSlides}`); // Log para verificar
}

// Função para atualizar o indicador de slide com bolinhas
function updateSlideIndicator(currentSlide) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide - 1); // Atualiza a classe "active"
    });
}

// Função de inicialização do formulário
function initializeForm() {
    const slideGroups = document.querySelectorAll('.carousel-slide'); // Busca os slides do carrossel
    if (slideGroups.length > 0) {
        displaySlide(currentSlide); // Mostrar o primeiro slide do carrossel
    } else {
        console.error('Nenhum grupo de formulário encontrado.');
    }
}

// Função para adicionar eventos aos botões de navegação
function setupSlideNavigation() {
    const prevSlideBtn = document.getElementById('prev_slide_btn');
    const nextSlideBtn = document.getElementById('next_slide_btn');

    const slideGroups = document.querySelectorAll('.carousel-slide');
    const totalSlides = slideGroups.length; // Determinar automaticamente o total de slides

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                displaySlide(currentSlide);
            }
        });
    } else {
        console.error('Botão "Voltar" não encontrado.');
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                displaySlide(currentSlide);
            }
        });
    } else {
        console.error('Botão "Avançar" não encontrado.');
    }
}

function skipQuestionnaire() {
    // Exemplo: Redirecionar para outra página
    window.location.href = '/comecar';
}

const form = document.getElementById('questionnaire-form');
const submitButton = document.querySelector('.submit-btn'); // Seleciona o botão de envio

submitButton.addEventListener('click', (e) => {
    e.preventDefault(); // Evita o envio automático do formulário

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Enviar os dados via fetch
    fetch('/submit-questionnaire', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Converte os dados para JSON
    })
    .then((response) => response.json()) // Aguarda a resposta JSON
    .then((data) => {
        console.log('Resposta do servidor:', data);
        alert('Questionário enviado com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao enviar o formulário:', error);
        alert('Houve um erro ao enviar o formulário. Tente novamente.');
    });
});

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initializeForm(); // Inicializar o formulário
    setupSlideNavigation(); // Configurar navegação entre os slides
});
