document.addEventListener('DOMContentLoaded', () => {
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentsList = document.querySelector('.appointments');  // Seleciona pela classe
    
    // Verifica se o appointmentsList foi encontrado
    if (appointmentsList) {
        // Função para filtrar os agendamentos pela data
        function filterAppointmentsByDate(selectedDate) {
            // Converte a data selecionada em um objeto Date
            const selectedDateObj = new Date(selectedDate);
            const allAppointments = appointmentsList.getElementsByClassName('consultas');
            
            for (let appointment of allAppointments) {
                // Pega a data do agendamento no formato do HTML
                const appointmentDate = appointment.querySelector('span').textContent;
                
                // Converte a data do agendamento para um objeto Date (supondo que o formato seja YYYY-MM-DD)
                const appointmentDateObj = new Date(appointmentDate);

                // Se a data do agendamento for maior ou igual à data selecionada, exibe o agendamento
                if (appointmentDateObj >= selectedDateObj) {
                    appointment.style.display = 'block'; // Exibe o agendamento
                } else {
                    appointment.style.display = 'none'; // Oculta o agendamento
                }
            }
        }

        // Evento de mudança no seletor de data
        appointmentDateInput.addEventListener('change', (e) => {
            filterAppointmentsByDate(e.target.value);
        });

        // Inicializa a lista de agendamentos com a data atual
        filterAppointmentsByDate(appointmentDateInput.value);
    } else {
        console.error('Elemento appointments-list não encontrado!');
    }
});
