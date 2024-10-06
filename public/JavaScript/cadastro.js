const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', function() {
    function formatCPF(input) {
        // Remove qualquer caractere que não seja número
        let value = input.value.replace(/\D/g, '');
    
        // Adiciona a formatação (ex: 123.456.789-00)
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2'); // 123.456
            value = value.replace(/(\d{3})(\d)/, '$1.$2'); // 123.456.789
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // 123.456.789-00
        }
    
        input.value = value;
    }
    
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
    const cpf = document.getElementById('cpf').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const password = document.getElementById('password').value;
    
    // Limpa as mensagens anteriores
    document.getElementById('hint1').textContent = "● Mínimo de 8 dígitos";
    document.getElementById('hint2').textContent = "● Não usar o CPF ou número sequencial";

    // Verifica se a senha tem menos de 8 dígitos
    if (password.length < 8) {
      document.getElementById('hint1').textContent = "● A senha deve ter pelo menos 8 dígitos.";
      document.getElementById('hint2').textContent = " ";
      event.preventDefault(); // Bloqueia o envio do formulário
      return;
    }

    // Verifica se a senha é igual ao CPF
    if (password === cpf) {
      document.getElementById('hint1').textContent = "● A senha não pode ser igual ao CPF.";
      document.getElementById('hint2').textContent = " ";
      event.preventDefault(); // Bloqueia o envio do formulário
      return;
    }

    // Verifica se a senha é um número sequencial
    const sequentialNumbers = Array.from({ length: 10 }, (_, i) => i.toString().repeat(8)); // Gera sequências de 0 a 9 com 8 dígitos
    if (sequentialNumbers.includes(password)) {
      document.getElementById('hint1').textContent = "● A senha não pode ser um número sequencial.";
      document.getElementById('hint2').textContent = " ";
      event.preventDefault(); // Bloqueia o envio do formulário
      return;
    }
  });