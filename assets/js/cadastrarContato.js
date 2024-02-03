document.getElementById('btnCadastrar').addEventListener('click', function(e) {
    e.preventDefault(); // Impede o envio do formulário de maneira tradicional

    // Captura os valores dos campos
    const nome = document.getElementById('nomeContato').value.trim();
    const idade = document.getElementById('campoIdade').value.trim();
    
    // Captura todos os números de telefone
    const inputsTelefone = document.querySelectorAll('#telefoneContainer input');
    const telefones = Array.from(inputsTelefone).map(input => input.value.trim()).filter(value => value);

    // Verifica se algum campo obrigatório está vazio ou se não há telefones válidos
    if (!nome || !idade || telefones.length === 0) {
        Swal.fire({
            title: 'Atenção!',
            text: 'Por favor, preencha todos os campos.',
            icon: 'info',
            confirmButtonText: 'Fechar'
        });
        return; // Interrompe a função
    }

    // Cria um objeto com os dados do formulário incluindo todos os telefones
    const dadosDoFormulario = {
        nome,
        idade,
        telefones // Aqui telefones é um array
    };

    fetch('http://localhost:8080/cadastrarContato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosDoFormulario),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data);
        Swal.fire({
            title: 'Cadastrado!',
            text: 'Seu contato foi cadastrado com sucesso',
            icon: 'success',
            confirmButtonText: 'Fechar'
        });
    })
    .catch((error) => {
        console.error('Erro:', error);
        Swal.fire({
            title: 'Falhou!',
            text: 'Seu contato não foi cadastrado! Tente novamente',
            icon: 'error',
            confirmButtonText: 'Fechar'
        });
    });
});