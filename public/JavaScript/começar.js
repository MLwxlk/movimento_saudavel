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
            <h2>Seus agendamentos</h2>
                <div id="agendamentos-box">
                    <select name="Ordenar" id="ordenar">
                        <option value="">Data</option>
                        <option value="">A-Z</option>
                    </select>
                    <div id="consultas-box">
                        <!-- conteudo da consulta
                        <div id="consultas">
                            <h3>CONSULTA MARCADA PARA O DIA <span id="dia_consult">02/10</span></h3><br>
                            <p>Dra. Paula <span id="hora_consult">15:30</span></p>
                        </div>
                        -->
                    </div>
                </div>
                <a id="agendamento-btn" href="#">NOVO AGENDAMENTO</a>
        `;
    } else if (tabName === 'exames') {
        dynamicContentDiv.innerHTML = `
            <h2>Seus exames</h2>
                    <div class="exames">
                        <select id="select">
                            <option value="">Data</option>
                            <option value="">A-Z</option>
                        </select>
                        <div id="exames-box">
                            <!-- Conteudo dos exames realizados
                            <div id="exames">
                                <h3>EXAME CONCLUIDO NO DIA <span id="dia_exame">02/10</span></h3><br>
                                <p>Dra. Paula <span id="hora_exame">15:30</span></p>
                            </div>
                            -->
                        </div>
                    </div>
                     <a id="btn_exames" href="#">MARCAR EXAME</a>
        `;
    } else if (tabName === 'metas') {
        dynamicContentDiv.innerHTML = `
            <h2>Metas da Semana</h2>
            <p>Aqui estão suas metas da semana...</p>
            <!-- Adicione mais conteúdo relevante aqui -->
        `;
    }
}
