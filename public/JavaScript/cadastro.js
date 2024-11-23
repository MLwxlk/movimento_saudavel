document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('cpf');
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');

    if (cpfInput && signupForm && passwordInput) {
        cpfInput.addEventListener('input', function () {
            formatCPF(cpfInput);
        });

        signupForm.addEventListener('submit', function (event) {
            const cpf = cpfInput.value.replace(/\D/g, '');
            const password = passwordInput.value;
            const hintContainer = document.querySelector('.password-hints');
            
            // Limpa as mensagens anteriores
            hintContainer.innerHTML = `
              <p><span>●</span> Mínimo de 8 dígitos</p>
              <p><span>●</span> Não usar o CPF ou número sequencial</p>
            `;
        
            let messages = [];
        
            // Validação do CPF
            function isValidCPF(cpf) {
                if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
                let sum, rest;
                sum = 0;
                for (let i = 1; i <= 9; i++) {
                    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
                }
                rest = (sum * 10) % 11;
                if (rest === 10 || rest === 11) rest = 0;
                if (rest !== parseInt(cpf.substring(9, 10))) return false;
                sum = 0;
                for (let i = 1; i <= 10; i++) {
                    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
                }
                rest = (sum * 10) % 11;
                if (rest === 10 || rest === 11) rest = 0;
                if (rest !== parseInt(cpf.substring(10, 11))) return false;
                return true;
            }
        
            if (!isValidCPF(cpf)) {
                messages.push("O CPF informado é inválido.");
            }
        
            // Verifica se a senha tem menos de 8 caracteres
            if (password.length < 8) {
                messages.push("A senha deve ter pelo menos 8 caracteres.");
            }
        
            // Verifica se a senha é igual ao CPF
            if (password === cpf) {
                messages.push("A senha não pode ser igual ao CPF.");
            }
        
            // Verifica se a senha é um número sequencial
            const sequentialNumbers = Array.from({ length: 10 }, (_, i) => i.toString().repeat(8));
            if (sequentialNumbers.includes(password)) {
                messages.push("A senha não pode ser um número sequencial.");
            }
        
            // Verifica se a senha contém uma letra maiúscula
            if (!/[A-Z]/.test(password)) {
                messages.push("A senha deve conter pelo menos uma letra maiúscula.");
            }
        
            // Verifica se a senha contém um caractere especial
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                messages.push("A senha deve conter pelo menos um caractere especial.");
            }
        
            // Se houver mensagens de erro, impedir o envio do formulário e exibir todas as mensagens em linhas separadas
            if (messages.length > 0) {
                hintContainer.innerHTML = messages.map(msg => `<p><span>●</span> ${msg}</p>`).join('');
                event.preventDefault(); // Bloqueia o envio do formulário
            }
        });        
    } else {
        console.error('Elementos não encontrados: cpf, signupForm ou passwordInput');
    }
});

function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    input.value = value;
}
