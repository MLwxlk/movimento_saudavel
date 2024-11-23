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
                    <!-- conteúdo das consultas -->
                </div>
            </div>
            <a id="agendamento-btn" href="#" class="tab" data-tab="novo-agend">NOVO AGENDAMENTO</a>
        `;
    
        // Verifica se o usuário está logado antes de exibir os agendamentos
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // Carrega os agendamentos do usuário logado
                    fetch('/agendamentos')
                        .then(response => response.json())
                        .then(agendamentos => {
                            const consultasBox = document.getElementById('consultas-box');
                            
                            if (agendamentos.length > 0) {
                                // Exibe os agendamentos
                                console.log(agendamentos);
                                agendamentos.forEach(agendamento => {
                                    const agendamentoDiv = document.createElement('div');
                                    agendamentoDiv.classList.add('consultas');
                                    agendamentoDiv.innerHTML = `
                                        <h3>Consulta marcada para o dia <span>${agendamento.data_consulta}</span></h3>
                                        <p>Dra. Paula <span>${agendamento.hora}</span></p>
                                    `;
                                    consultasBox.appendChild(agendamentoDiv);
                                });
                            } else {
                                consultasBox.innerHTML = '<p>Você não tem agendamentos.</p>';
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar agendamentos:', error);
                        });
                } else {
                    alert('Você precisa estar logado para ver seus agendamentos');
                    window.location.href = '/login'; // Redireciona para a página de login
                }
            })
            .catch(error => {
                console.error('Erro ao verificar login:', error);
                alert('Erro no servidor');
            });
    
        // Adiciona o evento para o botão "NOVO AGENDAMENTO"
        document.getElementById('agendamento-btn').addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
    
            // Verifica se o usuário está logado antes de permitir o agendamento
            fetch('/check-login')
                .then(response => response.json())
                .then(data => {
                    if (data.loggedIn) {
                        loadContent('novo-agend'); // Chama a função para carregar o conteúdo de "novo-agend"
                    } else {
                        alert('Você precisa estar logado para agendar uma consulta');
                        window.location.href = '/login'; // Redireciona para a página de login
                    }
                })
                .catch(error => {
                    console.error('Erro ao verificar login:', error);
                    alert('Erro no servidor');
                });
        });
    } else if (tabName === 'novo-agend') {
        dynamicContentDiv.innerHTML = `
            <p id="titulo">Agende a sua consulta<br> no melhor
                dia e horário para você.</p>
                <input type="date" id="data_consulta">
                <input type="text" id="hora">
                <a href="#" id="btn_agendar">AGENDAR</a>
        `;

        document.getElementById('btn_agendar').addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link

            const data_consulta = document.getElementById('data_consulta').value;
            const time = document.getElementById('hora').value;

            // Verifica se os campos de data e hora foram preenchidos
            if (!data_consulta || !time) {
                alert('Por favor, preencha todos os campos');
                return;
            }

            // Envia a requisição POST para o servidor
            fetch('/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data_consulta: data_consulta,
                    hora: time,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Consulta agendada com sucesso!');
                    loadContent('agendamentos');  // Carrega a página de agendamentos
                } else {
                    console.log(data);
                    alert('Erro ao agendar consulta');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro no servidor');
            });
        });
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
        document.getElementById('btn_exames').addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            loadContent('novo-agend'); // Chama a função para carregar o conteúdo de "novo-agend"
        });
    } else if (tabName === 'metas') {
        dynamicContentDiv.innerHTML = `
            <div id="metas">
                    <h2>Metas da semana</h2>
                    <nav id="dias">
                        <ul>
                            <li><button class="toggleButton off">DOM</button></li>
                            <li><button class="toggleButton off">SEG</button></li>
                            <li><button class="toggleButton off">TER</button></li>
                            <li><button class="toggleButton off">QUA</button></li>
                            <li><button class="toggleButton off">QUI</button></li>
                            <li><button class="toggleButton off">SEX</button></li>
                            <li><button class="toggleButton off">SAB</button></li>
                        </ul>
                    </nav>
                    <hr>
                    <div class="content-metas">
                        <p class="content-p">
                            <span id="data">xx/xx</span>
                            <span id="hora">xx:xx</span>
                        </p>
                        <button id="mostrarButton">+</button>
                        <div class="content-exercices" id="contentExercices">
                            <div class="exercices">
                                <span class="nome">Alongamento da coluna toracica</span>
                                <p class="descanço">x:xx</p>
                                <select name="dificuldade" id="dif-select">
                                    <option value="Fac">Facil</option>
                                    <option value="Mem">Medio</option>
                                    <option value="Dif">Dificil</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
        `;
        
        // Seleciona os elementos
        const toggleButton = document.getElementById('mostrarButton');
        const contentExercices = document.getElementById('contentExercices');

        // Adiciona o evento de clique ao botão
        toggleButton.addEventListener('click', () => {
            // Alterna a visibilidade do conteúdo
            if (contentExercices.style.display === 'none' || contentExercices.style.display === '') {
                contentExercices.style.display = 'block';  // Exibe o conteúdo
                toggleButton.textContent = '-';            // Muda o botão para "-"
            } else {
                contentExercices.style.display = 'none';   // Esconde o conteúdo
                toggleButton.textContent = '+';            // Muda o botão para "+"
            }
        });
    }
}

document.querySelectorAll('.toggleButton').forEach(button => {
    button.addEventListener('click', function() {
        // Alterna entre as classes "on" e "off" para o botão clicado
        if (this.classList.contains('off')) {
            this.classList.remove('off');
            this.classList.add('on');
        } else {
            this.classList.remove('on');
            this.classList.add('off');
        }
    });
});

