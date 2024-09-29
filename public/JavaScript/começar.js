document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault(); // Evita o comportamento padrão do link
        const tabName = e.target.dataset.tab;
        loadContent(tabName);
    });
});

function loadContent(tabName) {
    const dynamicContentDiv = document.getElementById('dynamic-content');

    // Carregar conteúdo baseado na aba clicada
    if (tabName === 'agendamentos') {
        dynamicContentDiv.innerHTML = `
            <h2>Agendamentos</h2>
            <p>Aqui estão seus agendamentos...</p>
            <!-- Adicione mais conteúdo relevante aqui -->
        `;
    } else if (tabName === 'exames') {
        dynamicContentDiv.innerHTML = `
            <h2>Exames</h2>
            <p>Aqui estão seus exames...</p>
            <!-- Adicione mais conteúdo relevante aqui -->
        `;
    } else if (tabName === 'metas') {
        dynamicContentDiv.innerHTML = `
            <h2>Metas da Semana</h2>
            <p>Aqui estão suas metas da semana...</p>
            <!-- Adicione mais conteúdo relevante aqui -->
        `;
    }
}
